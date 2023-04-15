import {
	Dispatch,
	FC,
	MouseEvent,
	SetStateAction,
	useRef,
	useState,
} from 'react'
import s from './AddNewCategory.module.scss'
import { ButtonBase } from '@/components/UI/ButtonBase/ButtonBase'
import { ModalBasic } from '@/components/UI/ModalBasic/ModalBasic'
import { colorPurple, colorWhite } from '@/config/colors'
import { useDarkMode } from '@/hooks/useDarkMode'
import { firebaseService } from '@/services/firebaseService'
import { Button, TextField } from '@mui/material'

interface AddNewCategoryProps {
	open: boolean
	setModalOpen: Dispatch<SetStateAction<boolean>>
	selectedCollection: string
}

export const AddNewCategory: FC<AddNewCategoryProps> = ({
	open,
	setModalOpen,
	selectedCollection,
}) => {
	const [value, setValue] = useState<string>('')
	const [color, setColor] = useState<string>('#1C93B0')
	const [errorMessage, setErrorMessage] = useState<string>('')

	const darkMode = useDarkMode()

	const handleClick = () => {
		if (value.length > 0) {
			firebaseService.addCategory(value, color, selectedCollection)
			setModalOpen(false)
		} else {
			setErrorMessage('Must contain at least one charachter')
		}
	}

	return (
		<ModalBasic open={open} onClose={() => setModalOpen(false)}>
			{errorMessage && <p className={s.error}>{errorMessage}</p>}
			<div className={s.inputs}>
				<input
					type="color"
					value={color}
					className={s.colorPicker}
					onChange={(e) => setColor(e.target.value)}
				/>
				<TextField
					style={{ width: '100%' }}
					autoComplete="off"
					value={value}
					onChange={(e) => {
						setValue(e.target.value)
						setErrorMessage('')
					}}
					sx={{
						'.MuiOutlinedInput-notchedOutline': {
							borderColor: darkMode ? 'var(--color-gray)' : '',
						},
						// hover
						'& .MuiOutlinedInput-root:hover fieldset': {
							borderColor: darkMode ? 'var(--color-gray)' : '',
						},
						// color text
						'& .MuiOutlinedInput-root': {
							color: darkMode ? 'black' : '',
						},
					}}
				/>
			</div>
			<ButtonBase
				backgroundColor={colorPurple}
				color={colorWhite}
				title="Add Category"
				onClick={() => handleClick()}
				className={s.button}
			/>
		</ModalBasic>
	)
}
