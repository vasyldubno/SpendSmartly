import {
	collection,
	deleteDoc,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { FC, MouseEvent, useState } from 'react'
import { ControllerRenderProps, FieldValue } from 'react-hook-form'
import { MdDeleteForever } from 'react-icons/md'
import { AddNewCategory } from './AddNewCategory/AddNewCategory'
import s from './SelectModal.module.scss'
import { db } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	useTheme,
} from '@mui/material'

interface SelectModalProps {
	categories: DocumentData[]
	selectedCollection: string
	field: any
	styles?: any
}

export const SelectModal: FC<SelectModalProps> = ({
	categories,
	selectedCollection,
	field,
	styles,
}) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [openSelect, setOpenSelect] = useState<boolean>(false)

	const { authUser } = useAuth()
	const userId = authUser?.uid as string

	const handleRemove = async (e: MouseEvent<SVGAElement>, category: any) => {
		e.stopPropagation()

		const categoryRef = collection(
			db,
			`users/${userId}/categories${capitalizeFirstLetter(selectedCollection)}s`
		)

		const queryRef = query(categoryRef, where('name', '==', `${category}`))

		const snapshot = (await getDocs(queryRef)).docs.map((res) => res.id)

		await deleteDoc(
			doc(
				db,
				`users/${userId}/categories${capitalizeFirstLetter(
					selectedCollection
				)}s`,
				...snapshot
			)
		)
	}

	const theme = useTheme()
	const darkMode = theme.palette.mode === 'dark'

	return (
		<FormControl className={s.wrapper}>
			<InputLabel
				id="demo-simple-select-label"
				sx={{
					color: darkMode ? 'var(--color-gray)' : '',
					'&.Mui-focused': { color: darkMode ? 'var(--color-gray)' : '' },
				}}
			>
				Category
			</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				label="Category"
				{...field}
				onOpen={() => setOpenSelect(true)}
				onClose={() => setOpenSelect(false)}
				sx={{
					// border input
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: darkMode ? 'var(--color-gray)' : '',
					},
					// hover
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: darkMode ? 'var(--color-gray)' : '',
					},
					// color text input
					'&.MuiOutlinedInput-root': {
						color: darkMode ? 'black' : '',
					},
					// focus
					'&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
						{
							borderColor: darkMode ? '#1976d2' : '',
						},
				}}
			>
				{categories.map((item, index) => (
					<MenuItem
						value={item.name as string}
						key={index}
						className={s.menuItem}
						disableRipple
						sx={{ '.MuiOutlinedInput-root': { color: 'red' } }}
					>
						{item.name}{' '}
						{field.value !== item.name && openSelect && (
							<MdDeleteForever
								className={s.iconRemove}
								onClick={(e: MouseEvent<SVGAElement>) =>
									handleRemove(e, item.name)
								}
							/>
						)}
					</MenuItem>
				))}
				<Button
					disableRipple
					className={s.button}
					onClick={() => setModalOpen(true)}
				>
					+ add new category
				</Button>
				{modalOpen && (
					<AddNewCategory
						open={modalOpen}
						setModalOpen={setModalOpen}
						selectedCollection={selectedCollection}
					/>
				)}
			</Select>
		</FormControl>
	)
}
