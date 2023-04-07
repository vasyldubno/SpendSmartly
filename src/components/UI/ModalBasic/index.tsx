import { FC, PropsWithChildren } from 'react'
import s from './ModalBasic.module.scss'
import { Box, Modal } from '@mui/material'

interface ModalBasicProps {
	open: boolean
	onClose: () => void
}

export const ModalBasic: FC<PropsWithChildren & ModalBasicProps> = ({
	children,
	onClose,
	open,
}) => {
	return (
		<>
			<Modal open={open} onClose={onClose}>
				<Box className={s.wrapper}>{children}</Box>
			</Modal>
		</>
	)
}
