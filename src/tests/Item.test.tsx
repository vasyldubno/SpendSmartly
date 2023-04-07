import { fireEvent, render, screen } from '@testing-library/react'
import { Item } from './Item'

describe('', () => {
	it('', () => {
		render(<Item />)

		const button = screen.getByRole('button', { name: 'click' })
		fireEvent.click(button)
	})
})

export {}
