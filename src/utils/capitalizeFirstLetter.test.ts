import { capitalizeFirstLetter } from './capitalizeFirstLetter'

describe('capitalizeFirstLetter', () => {
	it('', () => {
		const result = capitalizeFirstLetter('expenses')
		expect(result).toEqual('Expense')
	})
})

export {}
