import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { Hamburger } from './Hamburger/Hamburger'
import s from './Header.module.scss'
import { ModeSwitch } from './ModeSwitch/ModeSwitch'
import { colorPurple, colorWhite } from '@/config/colors'
import { auth } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Box, useTheme } from '@mui/material'
import { ButtonBase } from '../UI/ButtonBase/ButtonBase'
import { Container } from '../UI/Container/Container'

export const Header: FC = () => {
	const { authUser, isLoading, signOut } = useAuth()
	const router = useRouter()
	const theme = useTheme()

	// const isLoading = false
	// const [authUser, setAuthUser] = useState(false)
	// useEffect(() => {
	// 	const authorized = localStorage.getItem('authorized')
	// 	if (authorized) {
	// 		setAuthUser(true)
	// 	}
	// }, [])

	const handleSignOut = () => {
		signOut()
		router.push('/')
	}

	return (
		<Container
			styles={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<div className={s.leftSide}>
				<Link href="/" aria-label="Profile">
					<div className={s.imageWrapper}>
						{auth?.currentUser?.photoURL === null ? (
							<FaUserCircle id="dark" className={s.image} />
						) : (
							<Image
								src={auth.currentUser?.photoURL as string}
								alt="Avatar"
								width={32}
								height={32}
								style={{ borderRadius: '20px' }}
							/>
						)}
					</div>
				</Link>
				<div className={s.name}>{auth.currentUser?.displayName}</div>
			</div>
			<div className={s.rightSide}>
				<ModeSwitch />
				<Link href="/settings" data-testid="settings" aria-label="Settings">
					<Box style={{ width: '2rem', height: '2rem' }}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke={theme.palette.mode === 'dark' ? 'white' : 'black'}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</Box>
				</Link>
				{authUser && !isLoading && (
					<ButtonBase
						backgroundColor={colorPurple}
						color={colorWhite}
						onClick={handleSignOut}
						title="Sign Out"
					/>
				)}
			</div>
			<Hamburger />
		</Container>
	)
}
