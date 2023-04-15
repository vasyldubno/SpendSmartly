import Head from 'next/head'
import { FC } from 'react'

interface HeadLayoutProps {
	title?: string
}

export const HeadLayout: FC<HeadLayoutProps> = ({ title }) => {
	return (
		<Head>
			<title>{title}</title>
		</Head>
	)
}

HeadLayout.defaultProps = {
	title: 'SpendSmartly',
}
