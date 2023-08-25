import { FC } from 'react'
import { ExpenseItem } from './ExpenseItem/ExpenseItem'
import s from './Expenses.module.scss'
import { ExpensesProps } from './expenses.interface'
import { Box, TextField } from '@mui/material'
import { Container } from '../UI/Container/Container'
import { DatePickerUI } from '../UI/DatePickerUI/DatePickerUI'

export const Expenses: FC<ExpensesProps> = ({
	list,
	startDate,
	endDate,
	setEndDate,
	setStartDate,
	title,
	collection,
}) => {
	return (
		<Container>
			<Box className={s.header}>
				<h2 className={s.title}>{title}</h2>
				<div className={s.datePickers}>
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
				</div>
			</Box>
			<section className={s.expenses} data-testid="section">
				{list.length > 0 ? (
					list.map((item, index) => (
						<ExpenseItem
							item={item}
							key={index}
							startDate={startDate}
							endDate={endDate}
							collection={collection}
						/>
					))
				) : (
					<p className={s.empty}>You don&apos;t have transactions yet.</p>
				)}
			</section>
		</Container>
	)
}
