import { useTheme } from '@mui/material'

export const useDarkMode = () => {
	const theme = useTheme()
	const darkMode = theme.palette.mode === 'dark'
	return darkMode
}
