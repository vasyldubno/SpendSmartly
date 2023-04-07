import { zodResolver } from '@hookform/resolvers/zod'
import { FC, SetStateAction, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import s from './ModalAccount.module.scss'
import { useAuth } from '@/components/AuthProvider'
import { ButtonBase } from '@/components/UI/ButtonBase/ButtonBase'
import { ModalBasic } from '@/components/UI/ModalBasic'
import { colorPurple, colorWhite } from '@/config/colors'
import { firebaseService } from '@/services/firebaseService'
import { Currency } from '@/types/CurrencyType'
import { getListCurrencies } from '@/utils/getListCurrencies'
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material'

interface ModalNewAccountProps {
	open: boolean
	setOpen: (value: SetStateAction<boolean>) => void
}

export const ModalNewAccount: FC<ModalNewAccountProps> = ({
	open,
	setOpen,
}) => {
	const [currenciesList] = useState<Currency[]>(
		Object.values(getListCurrencies())
	)

	const { authUser } = useAuth()
	const userId = authUser?.uid as string

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
		currency: z.string().min(2, 'Choose currency'),
	})

	type FormSchema = z.infer<typeof formSchema>

	const {
		formState: { errors },
		handleSubmit,
		control,
		reset,
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: '',
			currency: '',
		},
	})

	const onSubmit: SubmitHandler<FormSchema> = (data) => {
		firebaseService.addNewAccount(data.currency, userId, data.amount)
		setOpen(false)
		reset()
	}

	return (
		<ModalBasic open={open} onClose={() => setOpen(false)}>
			<form onSubmit={handleSubmit(onSubmit)}>
				{errors.currency && (
					<p className={s.error}>{errors.currency.message}</p>
				)}
				<Controller
					control={control}
					name="currency"
					render={({ field }) => (
						<FormControl style={{ width: '100%', marginBottom: '1rem' }}>
							<InputLabel id="demo-simple-select-label">Currency</InputLabel>
							<Select
								label="Currency"
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								{...field}
							>
								{currenciesList.map((currency) => (
									<MenuItem key={currency.code} value={currency.code}>
										{currency.code} - {currency.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				/>

				{errors.amount && <p className={s.error}>{errors.amount.message}</p>}
				<Controller
					control={control}
					name="amount"
					render={({ field }) => (
						<TextField label="Balance" style={{ width: '100%' }} {...field} />
					)}
				/>
				<ButtonBase
					backgroundColor={colorPurple}
					color={colorWhite}
					title="Add new account"
					type="submit"
					style={{ marginTop: '1rem' }}
				/>
			</form>
		</ModalBasic>
	)
}
