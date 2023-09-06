import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import s from './HomeScreen.module.scss'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { ButtonBase } from '@/components/UI/ButtonBase/ButtonBase'
import { Container } from '@/components/UI/Container/Container'
import { Loader } from '@/components/UI/Loader/Loader'
import { colorPurple, colorWhite } from '@/config/colors'
import { useAuth } from '@/hooks/useAuth'
import { LogoIcon } from '@/icons/LogoIcon'

export const HomeScreen: FC = () => {
	const { authUser, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (authUser) {
			router.push('/dashboard')
		}
	}, [authUser])

	const variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.5,
			},
		},
	}

	const child = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
			transition: {
				duration: 1,
			},
		},
	}

	return (
		<>
			<HeadLayout />
			{isLoading && (
				<div style={{ textAlign: 'center', width: '100dvw', height: '100dvh' }}>
					<Loader />
				</div>
			)}
			{!isLoading && !authUser?.uid && (
				<div>
					<AnimatePresence>
						<motion.div variants={variants} initial="hidden" animate="show">
							<motion.div variants={child}>
								<Container
									styles={{
										display: 'flex',
										alignItems: 'center',
										top: '50%',
										left: '50%',
										position: 'absolute',
										transform: 'translate(-50%, -50%)',
										width: '100%',
									}}
								>
									<div
										style={{
											width: '100%',
											// marginTop: '5rem',
											display: 'flex',
											flexDirection: 'column',
											gap: '2rem',
										}}
									>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: '2rem',
											}}
										>
											<div style={{ width: '50px', height: '50px' }}>
												<LogoIcon />
											</div>
											<h1 className={`${s.title} ${s.bold}`}>SpendSmartly</h1>
										</div>
										<h1 className={s.h2} style={{ fontWeight: 'bold' }}>
											Take Control of Your Finances
										</h1>
										<div style={{ maxWidth: '600px', margin: '0 auto' }}>
											<p className={s.p}>
												Ready to conquer your personal finance demons?
												Don&apos;t let them weigh you down any longer! Join to
												us today and experience financial freedom.
											</p>
										</div>
										<div style={{ textAlign: 'center', marginTop: '2rem' }}>
											<Link href="/login">
												<ButtonBase
													title="Get Started"
													backgroundColor={colorPurple}
													color={colorWhite}
												/>
											</Link>
										</div>
									</div>
								</Container>
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</div>
			)}
		</>
	)
}
