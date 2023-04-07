import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { ModalCurrency } from './ModalCurrency/ModalCurrency'
import { useAuth } from '@/components/AuthProvider'
import { HeadLayout } from '@/components/HeadLayout'
import { Header } from '@/components/Header/Header'
import { Container } from '@/components/UI/Container/Container'
import { Loader } from '@/components/UI/Loader'
import { auth } from '@/config/firebase'
import { Box, Tooltip } from '@mui/material'

export const Settings = () => {
	const router = useRouter()

	const [openCurrency, setOpenCurrency] = useState<boolean>(false)
	const [currency, setCurrency] = useState('')

	const { authUser, isLoading } = useAuth()

	const email = authUser?.email as string
	const name = auth.currentUser?.displayName

	useEffect(() => {
		if (!authUser && !isLoading) {
			router.push('/')
		}
		setCurrency(authUser?.currency as string)
	}, [authUser])

	return (
		<>
			<HeadLayout title="Settings | Finance Tracker" />
			<Container>
				{authUser && !isLoading ? (
					<>
						<Header />
						<h1>SETTINGS</h1>
						<Box>
							<p>Email: {email}</p>
							<p>Name: {name}</p>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<p>Currency: {currency}&nbsp;</p>
								<Tooltip title="Change currency" placement="right">
									<Box sx={{ width: '16px', height: '16px' }}>
										<BsPencilSquare
											onClick={() => setOpenCurrency(true)}
											style={{ cursor: 'pointer' }}
										/>
									</Box>
								</Tooltip>
							</div>

							<ModalCurrency
								open={openCurrency}
								setOpen={setOpenCurrency}
								setState={setCurrency}
							/>
						</Box>
					</>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Loader />
					</div>
				)}
			</Container>
		</>
	)
}
