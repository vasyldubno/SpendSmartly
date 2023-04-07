import { render, screen, fireEvent } from '@testing-library/react'
import { Register } from './Register'

jest.mock('@/utils/getListCurrencies', () => {
	return {
		getListCurrencies() {
			return {
				USD: {
					name: 'US Dollar',
					symbol_native: '$',
					symbol: '$',
					code: 'USD',
					name_plural: 'US dollars',
					rounding: 0,
					decimal_digits: 2,
				},
				UAH: {
					name: 'Ukrainian Hryvnia',
					symbol_native: '₴',
					symbol: '₴',
					code: 'UAH',
					name_plural: 'Ukrainian hryvnias',
					rounding: 0,
					decimal_digits: 2,
				},
			}
		},
	}
})

jest.mock('firebase/functions', () => ({
	getFunctions: jest.fn(),
}))

const mockPush = jest.fn()
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
	route: '/',
	push: mockPush,
}))

jest.mock('@mui/material', () => {
	return {
		...jest.requireActual('@mui/material'),
		FormControl: jest.fn((props) => <div>{props.children}</div>),
		InputLabel: jest.fn((props) => (
			<label htmlFor="cur">{props.children}</label>
		)),
		Select: jest.fn((props) => <select id="cur">{props.children}</select>),
		MenuItem: jest.fn((props) => (
			<option value={props.value}>{props.children}</option>
		)),
	}
})

describe('Register Component', () => {
	beforeEach(() => {
		render(<Register />)
	})

	it('change input Name', () => {
		const inputName: HTMLInputElement = screen.getByPlaceholderText('Name')
		fireEvent.change(inputName, { target: { value: 'Vasyl' } })
		expect(inputName.value).toEqual('Vasyl')
	})

	it('change input Email', () => {
		const inputEmail: HTMLInputElement = screen.getByPlaceholderText('Email')
		fireEvent.change(inputEmail, { target: { value: 'vasyl@gmail.com' } })
		expect(inputEmail.value).toEqual('vasyl@gmail.com')
	})

	it('change input Password', () => {
		const inputPassword: HTMLInputElement =
			screen.getByPlaceholderText('Password')
		fireEvent.change(inputPassword, { target: { value: 'password' } })
		expect(inputPassword.value).toEqual('password')
	})

	it('shows and hides the password when showPassword button is clicked', () => {
		const showPasswordButton = screen.getByRole('button', { name: 'SHOW' })
		const passwordInput = screen.getByLabelText('Password')
		fireEvent.click(showPasswordButton)
		expect(passwordInput).toHaveAttribute('type', 'text')
		fireEvent.click(showPasswordButton)
		expect(passwordInput).toHaveAttribute('type', 'password')
	})

	it('select Currency', () => {
		const select: HTMLSelectElement = screen.getByRole('combobox', {
			name: 'Currency',
		})
		const options: HTMLOptionElement[] = screen.getAllByRole('option')
		expect(options).toHaveLength(2)
		fireEvent.select(select, { target: { value: 'USD' } })
		expect(select.value).toEqual('USD')
	})
})

export {}
