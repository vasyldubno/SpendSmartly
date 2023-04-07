import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { HeadLayout } from '@/components/HeadLayout'
import { Layout } from '@/components/Layout/Layout'
import { Login } from '@/components/Login/Login'
import { Container } from '@/components/UI/Container/Container'
import { Loader } from '@/components/UI/Loader'
import { auth } from '@/config/firebase'

export default function Home() {
	const { authUser, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (authUser) {
			router.push('/dashboard')
		}
	}, [authUser])

	return (
		<>
			<HeadLayout />
			<div>
				{!authUser && !isLoading ? (
					<Container
						styles={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Layout />
						<h1>Welcome to Finance Tracker</h1>
						<Login />
					</Container>
				) : (
					<Container
						styles={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Loader />
					</Container>
				)}
			</div>
		</>
	)
}
