import { ThemeContext, useMode } from '../context/ThemeContext'
import '../styles/globals.scss'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import React, { useEffect } from 'react'
import { AuthProvider } from '@/components/AuthProvider'
import { reportAccessibility } from '@/utils/reportAccessibility'
import { CssBaseline, StyledEngineProvider, useTheme } from '@mui/material'

export default function App({ Component, pageProps }: AppProps) {
	const theme = useTheme()
	return (
		<AuthProvider>
			<ThemeContext>
				<StyledEngineProvider injectFirst>
					<main
						style={{
							// backgroundColor: '#fff6e5',
							height: '100vh',
							padding: '1rem',
						}}
					>
						<CssBaseline />
						<Component {...pageProps} />
					</main>
				</StyledEngineProvider>
			</ThemeContext>
		</AuthProvider>
	)
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
	if (metric.label === 'web-vital') {
		console.log(metric)
	}
}

reportAccessibility(React)
