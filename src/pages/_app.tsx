import { ThemeContext } from '../providers/ThemeContext'
import '../styles/globals.scss'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { AuthProvider } from '@/providers/AuthProvider'
import { reportAccessibility } from '@/utils/reportAccessibility'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('/sw.js').then(
					(registration) => {
						// console.log(
						// 	'Service Worker registration successful with scope: ',
						// 	registration.scope
						// )
					},
					(err) => {
						// console.log('Service Worker registration failed: ', err)
					}
				)
			})
		}
	}, [])
	return (
		<>
			<Head>
				<meta name="application-name" content="SpendSmartly" />
				<meta name="description" content="Finance tracker for your money" />
				<meta name="theme-color" content="#fff6e5" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="index, follow" />
				<meta name="keywords" content="finance spend money" />
			</Head>
			<AuthProvider>
				<ThemeContext>
					<StyledEngineProvider injectFirst>
						<main
							style={{
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
		</>
	)
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
	if (metric.label === 'web-vital') {
		console.log(metric)
	}
}

reportAccessibility(React)
