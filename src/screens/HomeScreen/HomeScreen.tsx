import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import s from './HomeScreen.module.scss'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { Layout } from '@/components/Layout/Layout'
import { LayoutNotAuth } from '@/components/LayoutNotAuth/LayoutNotAuth'
import { Login } from '@/components/Login/Login'
import { Container } from '@/components/UI/Container/Container'
import { Loader } from '@/components/UI/Loader/Loader'
import { useAuth } from '@/hooks/useAuth'

export const HomeScreen: FC = () => {
	const { authUser, isLoading } = useAuth()
	const router = useRouter()

	// useEffect(() => {
	// 	if (authUser) {
	// 		router.push('/dashboard')
	// 	}
	// }, [authUser])

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
			<div>
				<AnimatePresence>
					<motion.div variants={variants} initial="hidden" animate="show">
						<motion.div variants={child}>
							<LayoutNotAuth />
						</motion.div>
						<motion.div variants={child}>
							<Container
								styles={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										width: '100%',
										marginTop: '5rem',
									}}
								>
									<h1 className={s.title}>
										<span className={s.bold}>Simple way</span>
										<br /> to manage{' '}
										<span className={s.bold}>personal financies</span>
									</h1>
								</div>
							</Container>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			</div>
		</>
	)
}
