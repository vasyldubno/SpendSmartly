import { FC } from 'react'
import { ExpenseItem } from './ExpenseItem/ExpenseItem'
import s from './Expenses.module.scss'
import { ExpensesProps } from './expenses.interface'
import { FONT } from '@/config/consts'
import { Box, TextField } from '@mui/material'
import { Container } from '../UI/Container/Container'
import { DatePickerUI } from '../UI/DatePickerUI'

export const Expenses: FC<ExpensesProps> = ({
	list,
	startDate,
	endDate,
	setEndDate,
	setStartDate,
}) => {
	return (
		<Container>
			<Box className={s.header}>
				<h2 className={s.title}>My Expenses</h2>
				<DatePickerUI
					selectedDate={startDate}
					setSelectedDate={setStartDate}
					component={<TextField label="Start Date" />}
					config={{
						showMonthYearPicker: true,
						selectsStart: true,
					}}
					dateFormat="MMMM yyyy"
				/>
				<DatePickerUI
					selectedDate={endDate}
					setSelectedDate={setEndDate}
					component={<TextField label="End Date" />}
					config={{ showMonthYearPicker: true, selectsEnd: true }}
					dateFormat="MMMM yyyy"
				/>
			</Box>
			<section className={s.expenses}>
				{list.length > 0 ? (
					list.map((item, index) => <ExpenseItem item={item} key={index} />)
				) : (
					<p className={s.empty}>You don&apos;t have expenses yet.</p>
				)}
			</section>
		</Container>
	)
}
