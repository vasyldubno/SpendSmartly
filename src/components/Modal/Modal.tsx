import { useAuth } from '../AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ModalMUI from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import {
	DocumentData,
	FieldPath,
	FieldValue,
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	updateDoc,
	increment,
	getDocs,
} from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import s from './Modal.module.scss'
import { SelectModal } from './SelectModal/SelectModal'
import { colorPurple, colorWhite } from '@/config/colors'
import { db } from '@/config/firebase'
import { useDarkMode } from '@/hooks/useDarkMode'
import { fetchCollection, firebaseService } from '@/services/firebaseService'
import { Entry } from '@/types/EntryType'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import { TextField, useTheme } from '@mui/material'
import { ButtonBase } from '../UI/ButtonBase/ButtonBase'
import { DatePickerUI } from '../UI/DatePickerUI'
import { EntryItem } from '../UI/EntryItem/EntryItem'

interface ModalProps {
	modalOpen: boolean
	setModalOpen: Dispatch<React.SetStateAction<boolean>>
	selectedCollection: string
}

export const Modal: FC<ModalProps> = ({
	modalOpen,
	setModalOpen,
	selectedCollection,
}) => {
	const [incomeItems, setIncomeItems] = useState<Entry[] | []>([])
	const [categories, setCategories] = useState<DocumentData[]>([])
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [errorAmount, setErrorAmount] = useState<string>('')
	const [prevBalance, setPrevBalance] = useState<number>(0)

	const darkMode = useDarkMode()
	const { authUser } = useAuth()
	const userId = authUser?.uid as string
	const currency = authUser?.currency as string

	const numberRegex = /^(\d+(\.\d*)?|\.\d+)$/

	const formSchema = z.object({
		amount: z
			.string()
			.refine((amount) => amount.length > 0, {
				message: 'Must be at least 0.01',
			})
			.refine((amount) => numberRegex.test(amount), {
				message: 'Must be only numbers',
			})
			.refine(
				(value) => {
					const modValue = Number(value)
					return modValue > 0
				},
				{
					message: 'Must be at least 0.01',
				}
			),
		category: z.string().min(1, 'Error in category'),
		description: z.string().optional(),
	})

	type FormSchema = z.infer<typeof formSchema>

	const {
		formState: { errors },
		handleSubmit,
		reset,
		control,
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const handleClose = () => {
		setModalOpen(false)
		reset()
	}

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		reset()
		setSelectedDate(new Date())

		const selectedCategory = categories.find(
			(category) => category.name === data.category
		) as { name: string; color: string }

		const newEntry = {
			category: data.category,
			amount: Number(data.amount),
			description: data.description,
			color: selectedCategory.color,
			date: Timestamp.fromDate(selectedDate),
		}

		await addDoc(
			collection(db, `users/${userId}/${selectedCollection}`),
			newEntry
		).then(async (res) => {
			await updateDoc(
				doc(db, `users/${userId}/${selectedCollection}`, res.id),
				{ id: res.id }
			)
		})

		const settingsRef = collection(db, `users/${userId}/settings`)
		if (selectedCollection === 'expenses') {
			await getDocs(settingsRef).then((res) => {
				res.forEach(async (item) => {
					const { id } = item
					await updateDoc(doc(db, `users/${userId}/settings`, id), {
						balance: increment(-Number(data.amount)),
					})
				})
			})
		}
		if (selectedCollection === 'incomes') {
			await getDocs(settingsRef).then((res) => {
				res.forEach(async (item) => {
					const { id } = item
					await updateDoc(doc(db, `users/${userId}/settings`, id), {
						balance: increment(Number(data.amount)),
					})
				})
			})
		}
	}

	useEffect(() => {
		if (selectedCollection.length > 0) {
			const fetch = async () => {
				const result = (await fetchCollection(selectedCollection)) as Entry[]
				setIncomeItems(result)
			}
			fetch()

			const refCategories = `users/${userId}/categories${capitalizeFirstLetter(
				selectedCollection
			)}s`
			onSnapshot(collection(db, refCategories), (snapshot) => {
				setCategories(snapshot.docs.map((item) => item.data()))
			})

			const refItems = `users/${userId}/${selectedCollection}`
			onSnapshot(
				query(collection(db, refItems), orderBy('date', 'desc')),
				(snapshot) => {
					setIncomeItems(snapshot.docs.map((item) => item.data()) as Entry[])
				},
				(errors) => {
					console.log(errors)
				}
			)
		}
	}, [selectedCollection])

	const StylesTextField = {
		// focus
		'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: darkMode ? '#1976d2' : '',
		},
		// border about input
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: darkMode ? 'var(--color-gray)' : '',
		},
		// color text inside input & cursor
		'& .MuiOutlinedInput-root': {
			color: darkMode ? 'black' : '',
		},
		// hover
		'& .MuiOutlinedInput-root:hover fieldset': {
			borderColor: darkMode ? 'var(--color-gray)' : '',
		},
		'.MuiInputLabel-root': {
			// color legend text
			color: darkMode ? 'var(--color-gray)' : '',
		},
	}

	return (
		<div>
			<ModalMUI
				open={modalOpen}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className={s.wrapper}>
					<form onSubmit={handleSubmit(onSubmit)} className={s.form}>
						<Box className={s.inputs}>
							{errors.amount && (
								<p className={s.error}>{errors.amount.message}</p>
							)}
							<Controller
								name="amount"
								control={control}
								defaultValue=""
								render={({ field }) => {
									return (
										<TextField
											autoComplete="off"
											className={`${s.input}`}
											variant="outlined"
											label={`${capitalizeFirstLetter(
												selectedCollection
											)} amount`}
											sx={StylesTextField}
											{...field}
										/>
									)
								}}
							/>

							{errors.category && (
								<p className={s.error}>{errors.category.message}</p>
							)}
							<Controller
								control={control}
								name="category"
								defaultValue=""
								render={({ field }) => {
									return (
										<SelectModal
											categories={categories}
											selectedCollection={selectedCollection}
											field={field}
											styles={StylesTextField}
										/>
									)
								}}
							/>
							{errors.description && (
								<p className={s.error}>{errors.description.message}</p>
							)}

							<Controller
								name="description"
								control={control}
								defaultValue=""
								render={({ field }) => {
									return (
										<TextField
											className={`${s.input}`}
											autoComplete="off"
											variant="outlined"
											label={`${capitalizeFirstLetter(
												selectedCollection
											)} description`}
											{...field}
											sx={StylesTextField}
										/>
									)
								}}
							/>

							<DatePickerUI
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								component={
									<TextField
										label="Date"
										sx={StylesTextField}
										style={{ width: '100%' }}
									/>
								}
								config={{ scrollableYearDropdown: true }}
							/>
						</Box>

						<ButtonBase
							backgroundColor={colorPurple}
							color={colorWhite}
							title="Add Entry"
							type="submit"
						/>
					</form>

					<Typography className={s.header}>Income History</Typography>
					<AnimatePresence>
						{incomeItems.length > 0 &&
							incomeItems.map((item, index) => (
								<motion.div
									key={item.id}
									initial={{ x: -1000, opacity: 0 }}
									animate={{
										x: 0,
										opacity: 1,
										transition: { duration: 2 },
									}}
									exit={{ x: -1000, opacity: 0, transition: { duration: 1 } }}
									layoutId={item.id}
								>
									<EntryItem
										key={item.id}
										item={item}
										collection={selectedCollection}
										setIncomeItems={setIncomeItems}
									/>
								</motion.div>
							))}
					</AnimatePresence>
				</Box>
			</ModalMUI>
		</div>
	)
}
