import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { Login } from '@/components/Login/Login'
import { Container } from '@/components/UI/Container/Container'
import { PROJECT_NAME } from '@/config/consts'

export const LoginScreen = () => {
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
			<HeadLayout title={`Sign In | ${PROJECT_NAME}`} />
			{authUser && (
				<Container
					styles={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						paddingBottom: '1rem',
					}}
				>
					<h1>Sign In</h1>
					<Login />
				</Container>
			)}
		</>
	)
}
