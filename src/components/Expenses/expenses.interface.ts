import { Dispatch, SetStateAction } from 'react'

interface Expense {
	category: string
	totalAmount: number
	color: string
}

export interface ExpensesProps {
	list: Expense[]
	startDate: Date
	endDate: Date
	setStartDate: Dispatch<SetStateAction<Date>>
	setEndDate: Dispatch<SetStateAction<Date>>
}
