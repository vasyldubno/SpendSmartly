import { CSSProperties, ReactElement } from 'react'

export interface ButtonBaseProps {
	title: string
	backgroundColor: string
	color: string
	onClick?: () => void
	type?: 'button' | 'reset' | 'submit'
	className?: string
	style?: CSSProperties
	icon?: ReactElement
}
