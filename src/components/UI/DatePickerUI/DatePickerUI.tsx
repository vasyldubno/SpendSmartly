import React, { Dispatch, FC, SetStateAction } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerUIProps {
	selectedDate: Date
	setSelectedDate: Dispatch<SetStateAction<Date>>
	component: JSX.Element
	config?: Record<string, boolean>
	dateFormat?: string
}

export const DatePickerUI: FC<DatePickerUIProps> = ({
	selectedDate,
	setSelectedDate,
	component,
	config,
	dateFormat = 'dd/MM/yyyy',
}) => {
	const [open, setOpen] = React.useState(false)

	const handleDateChange = (date: Date) => {
		setSelectedDate(date)
		setOpen(false)
	}

	return (
		<form style={{ position: 'relative' }}>
			<DatePicker
				selected={selectedDate}
				onChange={handleDateChange}
				dateFormat={dateFormat}
				customInput={component}
				open={open}
				onInputClick={() => setOpen((prev) => !prev)}
				onClickOutside={() => setOpen(false)}
				{...config}
			/>
		</form>
	)
}
