import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import s from './Register.module.scss'
import { colorPurple, colorWhite } from '@/config/colors'
import { useAuth } from '@/hooks/useAuth'
import { Currency } from '@/types/CurrencyType'
import { getListCurrencies } from '@/utils/getListCurrencies'
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material'
import { ButtonBase } from '../UI/ButtonBase/ButtonBase'

export const Register: FC = () => {
	const [passwordType, setPasswordType] = useState<'password' | 'text'>(
		'password'
	)
	const [currencyList, setCurrencyList] = useState<Currency[]>([])

	const { signUp } = useAuth()

	const formSchema = z.object({
		name: z.string().min(1, 'Minimal length of name is 1 char'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Must contain minimum 6 chars'),
		currency: z.string().min(1, 'Select currency'),
	})

	type FormSchema = z.infer<typeof formSchema>

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const onSubmit: SubmitHandler<FormSchema> = (data) => {
		signUp(data.email, data.password, data.name, data.currency)
	}

	const showPassword = () => {
		if (passwordType === 'password') {
			setPasswordType('text')
		} else {
			setPasswordType('password')
		}
	}

	useEffect(() => {
		setCurrencyList(Object.values(getListCurrencies()))
	}, [])

	return (
		<form className={s.form} onSubmit={handleSubmit(onSubmit)}>
			{errors.name && <p className={s.error}>{errors.name.message}</p>}
			<TextField
				className={s.input}
				autoComplete="off"
				variant="outlined"
				label="Name"
				placeholder="Name"
				{...register('name')}
			/>
			{errors.email && <p className={s.error}>{errors.email.message}</p>}
			<TextField
				className={s.input}
				autoComplete="off"
				variant="outlined"
				label="Email"
				placeholder="Email"
				{...register('email')}
			/>
			{errors.password && <p className={s.error}>{errors.password.message}</p>}
			<div style={{ width: '100%', position: 'relative' }}>
				<TextField
					className={s.input}
					autoComplete="off"
					type={passwordType}
					variant="outlined"
					label="Password"
					placeholder="Password"
					{...register('password')}
				/>
				<button onClick={showPassword} className={s.showPassword} type="button">
					SHOW
				</button>
			</div>

			{errors.currency && <p className={s.error}>{errors.currency.message}</p>}
			<Controller
				name="currency"
				control={control}
				render={({ field }) => (
					<FormControl className={s.selectCurrency}>
						<InputLabel id="demo-simple-select-label">Currency</InputLabel>
						<Select
							label="Currency"
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							{...field}
						>
							{currencyList.map((currency) => (
								<MenuItem key={currency.code} value={currency.code}>
									{currency.code} - {currency.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			/>

			<ButtonBase
				title="Sign Up"
				backgroundColor={colorPurple}
				color={colorWhite}
				className={s.button}
				type="submit"
			/>
		</form>
	)
}
