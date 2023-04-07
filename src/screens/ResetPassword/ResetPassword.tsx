import { zodResolver } from '@hookform/resolvers/zod'
import { checkActionCode } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import s from './ResetPassword.module.scss'
import { ButtonBase } from '@/components/UI/ButtonBase/ButtonBase'
import { Container } from '@/components/UI/Container/Container'
import { colorPurple, colorWhite } from '@/config/colors'
import { auth } from '@/config/firebase'
import { firebaseService } from '@/services/firebaseService'
import { TextField } from '@mui/material'

interface ResetPasswordProps {
	oobCode: string
}

export const ResetPassword: FC<ResetPasswordProps> = ({ oobCode }) => {
	const [passwordChanged, setPasswordChanged] = useState<boolean>(false)
	const [passwordType, setPasswordType] = useState<'password' | 'text'>(
		'password'
	)

	const formSchema = z.object({
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
		try {
			await firebaseService
				.resetPassword(oobCode, data.password)
				.then(() => setPasswordChanged(true))
		} catch (error: any) {
			console.log('error', error.message)
		}
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
			<Container
				styles={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				{passwordChanged ? (
					<>
						<p>You successfull changed password</p>
						<Link href="/" className={s.link}>
							Go to Home Page
						</Link>
					</>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className={s.form}>
						{errors.password && (
							<p className={s.error}>{errors.password.message}</p>
						)}
						<div style={{ position: 'relative', width: '100%' }}>
							<TextField
								className={s.input}
								autoComplete="off"
								variant="outlined"
								label="New Password"
								type={passwordType}
								{...register('password')}
							/>
							<button
								onClick={showPassword}
								className={s.showPassword}
								type="button"
							>
								SHOW
							</button>
						</div>
						<ButtonBase
							title="reset password"
							type="submit"
							backgroundColor={colorPurple}
							color={colorWhite}
						/>
					</form>
				)}
			</Container>
		</>
	)
}
