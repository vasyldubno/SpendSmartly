import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CgGoogle } from 'react-icons/cg'
import { z } from 'zod'
import s from './Login.module.scss'
import { useAuth } from '@/components/AuthProvider'
import { colorPurple, colorWhite } from '@/config/colors'
import { firebaseService } from '@/services/firebaseService'
import { TextField } from '@mui/material'
import { ButtonBase } from '../UI/ButtonBase/ButtonBase'

export const Login: FC = () => {
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [passwordType, setPasswordType] = useState<'password' | 'text'>(
		'password'
	)

	const { signIn } = useAuth()
	const router = useRouter()

	const formSchema = z.object({
		email: z.string().email('Invalid email address'),
		password: z.string(),
	})

	type FormSchema = z.infer<typeof formSchema>

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormSchema>({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
	})

	const onSubmit: SubmitHandler<FormSchema> = async (data) => {
		const response = await signIn(data.email, data.password)
		setErrorMessage(response as string)
	}

	const showPassword = () => {
		if (passwordType === 'password') {
			setPasswordType('text')
		} else {
			setPasswordType('password')
		}
	}

	return (
		<>
			<form className={s.form} onSubmit={handleSubmit(onSubmit)}>
				{errors.email && <p className={s.error}>{errors.email.message}</p>}
				<TextField
					className={s.input}
					autoComplete="off"
					variant="outlined"
					label="Email"
					placeholder="Email"
					{...register('email')}
				/>

				{errorMessage && <p className={s.error}>{errorMessage}</p>}
				<div
					style={{ width: '100%', position: 'relative' }}
					className={s.lastChild}
				>
					<TextField
						className={s.input}
						autoComplete="off"
						type={passwordType}
						variant="outlined"
						label="Password"
						placeholder="Password"
						{...register('password')}
					/>
					<button
						onClick={showPassword}
						className={s.showPassword}
						type="button"
					>
						SHOW
					</button>
					<Link href="/forgot-password" className={s.forgotPassword}>
						Forgot password?
					</Link>
				</div>

				<ButtonBase
					title="Sign In"
					backgroundColor={colorPurple}
					color={colorWhite}
					className={s.button}
					type="submit"
				/>
				<p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>or using</p>

				<ButtonBase
					title="Google"
					backgroundColor={colorPurple}
					color={colorWhite}
					className={s.button}
					icon={<CgGoogle style={{ marginRight: '1rem' }} />}
					onClick={() => firebaseService.handleGoogleAuth(router)}
				/>
			</form>

			<p className={s.register}>
				New user? <Link href="/register">Start here</Link>
			</p>
		</>
	)
}
