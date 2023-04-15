import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import s from './RegisterScreen.module.scss'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { Register } from '@/components/Register/Register'
import { Container } from '@/components/UI/Container/Container'
import { PROJECT_NAME } from '@/config/consts'

export const RegisterScreen = () => {
	const [authUser, setAuthUser] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const user = localStorage.getItem('authorized') as string
		if (user === 'true') {
			router.push('/dashboard')
		} else {
			setAuthUser(true)
		}
	}, [])
	return (
		<>
			<HeadLayout title={`Register | ${PROJECT_NAME}`} />
			{authUser && (
				<Container className={s.container}>
					<h1>Registration</h1>
					<Register />
				</Container>
			)}
		</>
	)
}
