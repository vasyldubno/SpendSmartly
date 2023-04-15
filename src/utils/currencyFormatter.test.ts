import { currencyFormatter } from './currencyFormatter'

describe('currencyFormatter', () => {
	it('should return USD currercy if currency null', () => {
		const result = currencyFormatter(1000, null)
		expect(result).toEqual('$1,000.00')
	})

	it('should return correctly currency', () => {
		const result = currencyFormatter(1000, 'EUR')
		expect(result).toEqual('€1,000.00')
	})
})

export {}
