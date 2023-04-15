import { render, screen } from '@testing-library/react'
import { Expenses } from './Expenses'

jest.mock('firebase/functions', () => ({
	getFunctions: jest.fn(),
}))

jest.mock('@/utils/currencyFormatter', () => ({
	currencyFormatter: jest.fn(),
}))

describe('Expenses', () => {
	it('should have 2 children elements', () => {
		const list = [
			{
				category: 'Utilities',
				totalAmount: 100,
				color: 'red',
			},
			{
				category: 'Grocery',
				totalAmount: 200,
				color: 'blue',
			},
		]
		render(
			<Expenses
				list={list}
				startDate={new Date()}
				endDate={new Date()}
				setStartDate={() => {}}
				setEndDate={() => {}}
			/>
		)
		expect(screen.getByTestId('section').children.length).toBe(2)
	})
})

export {}
