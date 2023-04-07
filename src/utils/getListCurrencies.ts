import CurrencyList from 'currency-list'

export const getListCurrencies = () => {
	const currencyList = CurrencyList.getAll('en')
	return currencyList
}
