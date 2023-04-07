import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import s from './ForgotPassword.module.scss'
import { ButtonBase } from '@/components/UI/ButtonBase/ButtonBase'
import { Container } from '@/components/UI/Container/Container'
import { colorPurple, colorWhite } from '@/config/colors'
import { firebaseService } from '@/services/firebaseService'
import { TextField } from '@mui/material'

export const ForgotPassword: FC = () => {
	const [errorUserNotFound, setErrorUserNotFound] = useState<string>('')
	const [emailSended, setEmailSended] = useState<boolean>(false)

	const formSchema = z.object({
		email: z.string().email('Invalid email address'),
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
				.forgotPassword(data.email)
				.then(() => setEmailSended(true))
		} catch (error: any) {
			if (error.message === 'Firebase: Error (auth/user-not-found).') {
				setErrorUserNotFound('User Not Found')
			}
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
				{emailSended ? (
					<p>Check email, we sended you link for reset password</p>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className={s.form}>
						{errors.email && <p className={s.error}>{errors.email.message}</p>}
						{errorUserNotFound && (
							<p className={s.error}>{errorUserNotFound}</p>
						)}
						<TextField
							className={s.input}
							autoComplete="off"
							variant="outlined"
							label="Email"
							placeholder="Email"
							{...register('email', {
								onChange: () => {
									setErrorUserNotFound('')
								},
							})}
						/>
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
