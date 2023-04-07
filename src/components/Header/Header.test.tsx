import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

jest.mock('firebase/functions', () => ({
	getFunctions: jest.fn(),
}))

jest.mock('@/components/AuthProvider', () => {
	return {
		useAuth() {
			return {
				authUser: {
					uid: 'bjbkjbjkvhjvj',
					email: 'test@gmail.com',
					currency: 'USD',
				},
				isLoading: false,
				signOut: jest.fn(),
			}
		},
	}
})

const mockPush = jest.fn()
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
	route: '/',
	push: mockPush,
}))

describe('', () => {
	it('button => settings', () => {
		render(<Header />)
		const button = screen.getByTestId('settings')
		userEvent.click(button)
		expect(button).toHaveAttribute('href', '/settings')
	})
	it('button => Sign Out', () => {
		render(<Header />)
		const button = screen.getByRole('button', { name: 'Sign Out' })
		expect(button).toBeInTheDocument()

		fireEvent.click(button)
		expect(mockPush).toHaveBeenCalledWith('/')
	})
})
