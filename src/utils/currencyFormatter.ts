export const currencyFormatter = (
	amount: number,
	currency: string | null
): string => {
	if (currency === null) {
		return Intl.NumberFormat('en-US', {
			currency: 'USD',
			style: 'currency',
		}).format(amount)
	}
	return Intl.NumberFormat('en-US', {
		currency,
		style: 'currency',
	}).format(amount)
}
