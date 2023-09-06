import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { ModalCurrency } from './ModalCurrency/ModalCurrency'
import s from './Settings.module.scss'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { Header } from '@/components/Header/Header'
import { Container } from '@/components/UI/Container/Container'
import { Loader } from '@/components/UI/Loader/Loader'
import { PROJECT_NAME } from '@/config/consts'
import { auth } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
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
			<HeadLayout title={`Settings | ${PROJECT_NAME}`} />
			<Container>
				{authUser && !isLoading ? (
					<>
						<Header />
						<h1 className={s.title}>SETTINGS</h1>
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
							width: '200px',
							height: '200px',
						}}
					>
						<Loader />
					</div>
				)}
			</Container>
		</>
	)
}
