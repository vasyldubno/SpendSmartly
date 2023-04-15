import { render, screen } from '@testing-library/react'
import { LoginScreen } from './LoginScreen'

const mockPush = jest.fn()
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
	route: '/',
	push: mockPush,
}))

describe('LoginScreen', () => {
	it('should render the sign in page when user is not authorized', () => {
		localStorage.clear()
		render(<LoginScreen />)
		expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
	})

	it('should redirect to dashboard when user is authorized', () => {
		localStorage.setItem('authorized', 'true')
		render(<LoginScreen />)
		expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
		expect(mockPush).toHaveBeenCalledWith('/dashboard')
	})
})

export {}
