import { FC } from 'react'
import { ButtonBaseProps } from './ButtonBase.interface'
import s from './ButtonBase.module.scss'
import { FONT } from '@/config/consts'
import { Button } from '@mui/material'

export const ButtonBase: FC<ButtonBaseProps> = ({
	color,
	onClick,
	title,
	type = 'button',
	backgroundColor,
	className,
	style,
	icon,
}) => {
	return (
		<Button
			className={`${className} ${s.wrapper}`}
			style={style}
			type={type}
			data-testid="sign"
			disableRipple
			variant="contained"
			onClick={onClick}
			sx={{
				fontFamily: FONT,
				fontWeight: '700',
				backgroundColor,
				color,
			}}
		>
			{icon} {title}
		</Button>
	)
}
