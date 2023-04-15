import { FC, PropsWithChildren } from 'react'
import s from './ModalBasic.module.scss'
import { Box, Modal } from '@mui/material'

interface ModalBasicProps {
	open: boolean
	onClose: () => void
	widthSize?: string
}

export const ModalBasic: FC<PropsWithChildren & ModalBasicProps> = ({
	children,
	onClose,
	open,
	widthSize,
}) => {
	return (
		<>
			<Modal open={open} onClose={onClose}>
				<Box className={s.wrapper} style={{ maxWidth: widthSize }}>
					{children}
				</Box>
			</Modal>
		</>
	)
}

ModalBasic.defaultProps = {
	widthSize: '400px',
}
