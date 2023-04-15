import { ModeSwitch } from '../ModeSwitch/ModeSwitch'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, MouseEvent, useState } from 'react'
import * as React from 'react'
import { HiMenu } from 'react-icons/hi'
import s from './Hamburger.module.scss'
import { useAuth } from '@/hooks/useAuth'

export const Hamburger: FC = () => {
	const { signOut } = useAuth()
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const router = useRouter()

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleSignOut = () => {
		signOut()
		router.push('/')
	}

	return (
		<div className={s.wrapper}>
			<Button
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				disableRipple
				disableFocusRipple
				disableTouchRipple
				onClick={handleClick}
				className={s.button}
			>
				<HiMenu className={s.icon} />
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				sx={{
					'& .MuiList-root': {
						paddingBottom: '0',
						paddingTop: '0',
					},
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
			>
				<MenuItem
					disableTouchRipple
					disableRipple
					sx={{
						'&:hover': {
							backgroundColor: 'transparent',
						},
					}}
				>
					<ModeSwitch />
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<Link href="/settings">Settings</Link>
				</MenuItem>
				<MenuItem onClick={handleSignOut}>Logout</MenuItem>
			</Menu>
		</div>
	)
}
