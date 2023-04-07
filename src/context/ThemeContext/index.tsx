import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { colorBgDark, colorBgLite } from '@/config/colors'
import { FONT } from '@/config/consts'
import { createTheme, ThemeProvider } from '@mui/material'

type ContextType = {
	changeMode: () => void
}

const ChangeContext = createContext<ContextType>({ changeMode: () => {} })

export const ThemeContext: FC<PropsWithChildren> = ({ children }) => {
	const [darkMode, setDarkMode] = useState<boolean>(false)

	const theme = createTheme({
		palette: {
			mode: darkMode ? 'dark' : 'light',
			background: {
				default: darkMode ? colorBgDark : colorBgLite,
			},
		},
		typography: {
			fontFamily: FONT,
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

export const useMode = () => useContext(ChangeContext)
