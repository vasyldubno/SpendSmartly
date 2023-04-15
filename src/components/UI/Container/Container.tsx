import { CSSProperties, FC, PropsWithChildren } from 'react'
import s from './Container.module.scss'

interface ContainerProps {
	styles?: CSSProperties
	className?: string
}

export const Container: FC<PropsWithChildren & ContainerProps> = ({
	children,
	styles,
	className,
}) => {
	return (
		<div className={`${s.wrapper} ${className}`} style={styles}>
			{children}
		</div>
	)
}
