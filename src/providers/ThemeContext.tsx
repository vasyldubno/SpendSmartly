import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { colorBgDark, colorBgLite } from '@/config/colors'
import { FONT } from '@/config/consts'
import { ChangeContext } from '@/context/ChangeContext'
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material'

export const ThemeContext: FC<PropsWithChildren> = ({ children }) => {
	const [darkMode, setDarkMode] = useState<boolean>(false)

	const smallPhone = useMediaQuery('(min-width: 279px)')
	const bigPhone = useMediaQuery('(min-width: 389px)')
	const tablet = useMediaQuery('(min-width: 767px)')
	const smallLaptop = useMediaQuery('(min-width: 1280px)')
	const bigLaptop = useMediaQuery('(min-width: 1440px)')

	const changeFont = () => {
		if (smallLaptop || bigLaptop) {
			return 14
		}
		if (tablet) {
			return 13
		}
		if (bigPhone) {
			return 12
		}
		if (smallPhone) {
			return 10
		}
	}

	const theme = createTheme({
		palette: {
			mode: darkMode ? 'dark' : 'light',
			background: {
				default: darkMode ? colorBgDark : colorBgLite,
			},
		},
		typography: {
			fontFamily: FONT,
			fontSize: 14,
		},
	})

	const changeMode = () => setDarkMode(!darkMode)

	useEffect(() => {
		const mode = localStorage.getItem('mode') === 'dark'
		if (mode) {
			setDarkMode(true)
		}
	}, [])

	const contextValue = useMemo(() => ({ changeMode }), [darkMode])

	useEffect(() => {
		const root = document.documentElement
		if (theme.palette.mode === 'dark') {
			localStorage.setItem('mode', 'dark')
			root.style.setProperty('--color-gray', '#7c7878')
			root.style.setProperty('--color-black', '#fff')
			root.style.setProperty('--color-border-input', '#0dc916')
		} else {
			localStorage.setItem('mode', 'light')
			root.style.setProperty('--color-gray', '#dad1d1')
			root.style.setProperty('--color-black', '#000')
			root.style.setProperty('--color-border-input', 'rgba(0, 0, 0, 0.23)')
		}
	}, [theme.palette.mode])

	return (
		<ChangeContext.Provider value={contextValue}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ChangeContext.Provider>
	)
}
