import { render, screen } from '@testing-library/react'
import { EntryItem } from './EntryItem'
import { currencyFormatter } from '@/utils/currencyFormatter'

jest.mock('firebase/functions', () => ({
	getFunctions: () => '$1',
}))

jest.mock('@/utils/currencyFormatter', () => ({
	currencyFormatter: jest.fn(),
}))

const item = {
	amount: 1,
	description: 'desc',
	category: 'cat',
	color: 'red',
	id: '1',
	date: {
		seconds: 1234,
		nanoseconds: 3456,
	},
}

describe('EntryItem', () => {
	it('', () => {
		render(
			<EntryItem collection="incomes" item={item} setIncomeItems={() => {}} />
		)
	})
})

export {}
