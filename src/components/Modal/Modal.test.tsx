/* eslint-disable @typescript-eslint/require-await */
import { fireEvent, render, screen } from '@testing-library/react'
import { Modal } from './Modal'

jest.mock('firebase/functions', () => ({
	getFunctions: jest.fn(),
}))

jest.mock('./SelectModal/SelectModal', () => ({
	SelectModal: () => {
		return (
			<select data-testid="select">
				<option value="Grocery">Grocery</option>
				<option value="Utilities">Utilities</option>
			</select>
		)
	},
}))

describe('Modal', () => {
	beforeEach(() => {
		render(
			<Modal modalOpen selectedCollection="expenses" setModalOpen={() => {}} />
		)
	})

	const setup = () => {
		const inputAmount: HTMLInputElement = screen.getByRole('textbox', {
			name: 'Expense amount',
		})
		const selectCategory: HTMLSelectElement = screen.getByTestId('select')
		const inputDescription: HTMLInputElement = screen.getByRole('textbox', {
			name: 'Expense description',
		})
		const inputDate: HTMLInputElement = screen.getByRole('textbox', {
			name: 'Date',
		})
		const button = screen.getByRole('button', { name: 'Add Entry' })

		return {
			inputAmount,
			selectCategory,
			inputDescription,
			inputDate,
			button,
		}
	}

	it('change field amount', () => {
		const { inputAmount } = setup()
		fireEvent.change(inputAmount, { target: { value: '10' } })
		expect(inputAmount.value).toEqual('10')
	})

	it('change field category', () => {
		const { selectCategory } = setup()
		fireEvent.change(selectCategory, { target: { value: 'Utilities' } })
		expect(selectCategory.value).toEqual('Utilities')
	})

	it('change field description', () => {
		const { inputDescription } = setup()
		fireEvent.change(inputDescription, { target: { value: 'desc' } })
		expect(inputDescription.value).toEqual('desc')
	})

	it('change field date', () => {
		const { inputDate } = setup()
		fireEvent.change(inputDate, { target: { value: '10/04/2023' } })
		expect(inputDate.value).toEqual('10/04/2023')
	})

	it('invalid field amount', async () => {
		const { inputAmount } = setup()
		fireEvent.change(inputAmount, { target: { value: '10b' } })
		const errorMessage = await screen.findByText('Must be only numbers')
		expect(errorMessage).toBeInTheDocument()
	})
})

export {}
