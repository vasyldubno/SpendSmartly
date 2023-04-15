import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'
import { mockUseAuth } from '@/mocks/mockUseAuth'

jest.mock('firebase/functions', () => ({
	getFunctions: jest.fn(),
}))

jest.mock('@/hooks/useAuth', () => ({
	useAuth: () => mockUseAuth,
}))

const mockPush = jest.fn()
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
	route: '/',
	push: mockPush,
}))

describe('', () => {
	beforeEach(() => {
		render(<Header />)
	})

	it('button => settings', () => {
		const button = screen.getByTestId('settings')
		userEvent.click(button)
		expect(button).toHaveAttribute('href', '/settings')
	})
	it('button => Sign Out', () => {
		const button = screen.getByRole('button', { name: 'Sign Out' })
		expect(button).toBeInTheDocument()
		fireEvent.click(button)
		expect(mockPush).toHaveBeenCalledWith('/')
	})
})
