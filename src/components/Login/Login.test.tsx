import { fireEvent, render, screen } from '@testing-library/react'
import { Login } from './Login'

jest.mock('firebase/functions', () => ({
	getFunctions: jest.fn(),
}))

const mockPush = jest.fn()
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
	route: '/',
	push: mockPush,
}))

jest.mock('@/services/firebaseService', () => ({
	handleGoogleAuth: jest.fn(),
}))

describe('Login', () => {
	beforeEach(() => {
		render(<Login />)
	})

	it('shoud render inputEmail & inputPassword', () => {
		const inputEmail = screen.getByPlaceholderText('Email')
		const inputPassword = screen.getByPlaceholderText('Password')
		expect(inputEmail).toBeInTheDocument()
		expect(inputPassword).toBeInTheDocument()
	})

	it('should change inputEmail & inputPassword', () => {
		const inputEmail: HTMLInputElement = screen.getByPlaceholderText('Email')
		const inputPassword: HTMLInputElement =
			screen.getByPlaceholderText('Password')
		fireEvent.change(inputEmail, { target: { value: 'vasyl@mail.com' } })
		fireEvent.change(inputPassword, { target: { value: 'vasyl' } })
		expect(inputEmail.value).toEqual('vasyl@mail.com')
		expect(inputPassword.value).toEqual('vasyl')
	})

	it('shows and hides the password when showPassword button is clicked', () => {
		const showPasswordButton = screen.getByRole('button', { name: 'SHOW' })
		const passwordInput = screen.getByLabelText('Password')

		fireEvent.click(showPasswordButton)
		expect(passwordInput).toHaveAttribute('type', 'text')

		fireEvent.click(showPasswordButton)
		expect(passwordInput).toHaveAttribute('type', 'password')
	})
})

export {}
