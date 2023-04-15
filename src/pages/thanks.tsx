import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Container } from '@/components/UI/Container/Container'
import { Loader } from '@/components/UI/Loader/Loader'
import { useAuth } from '@/hooks/useAuth'
import { Box } from '@mui/material'

const ThanksPage: NextPage = () => {
	const { authUser, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (authUser) {
			router.push('/dashboard')
		}
		if (!authUser && !isLoading) {
			router.push('/register')
		}
	}, [authUser, isLoading])

	console.log(authUser, isLoading)

	return (
		<>
			{authUser?.currency !== undefined && authUser.currency !== null ? (
				<Container>
					<h1>Thank you for register in out platform</h1>
					<Link href="/dashboard">Go to dashboard</Link>
				</Container>
			) : (
				<Box style={{ display: 'flex', justifyContent: 'center' }}>
					<Loader />
				</Box>
			)}
		</>
	)
}

export default ThanksPage
