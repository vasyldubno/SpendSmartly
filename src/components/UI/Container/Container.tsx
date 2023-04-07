import { CSSProperties, FC, PropsWithChildren } from 'react'
import s from './Container.module.scss'

interface ContainerProps {
	styles?: CSSProperties
}

export const Container: FC<PropsWithChildren & ContainerProps> = ({
	children,
	styles,
}) => {
	return (
		<div className={s.wrapper} style={styles}>
			{children}
		</div>
	)
}
