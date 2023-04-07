import { fireEvent, render, screen } from '@testing-library/react'
import { ButtonBase } from './ButtonBase'
import { colorPurple, colorWhite } from '@/config/colors'

describe('ButtonBase', () => {
	const handleClick = jest.fn()
	beforeEach(() => {
		render(
			<ButtonBase
				title="Add"
				backgroundColor={colorPurple}
				color={colorWhite}
				onClick={handleClick}
			/>
		)
	})

	it('should call handleClick after click on button', () => {
		const button = screen.getByRole('button', { name: 'Add' })
		fireEvent.click(button)
		expect(handleClick).toHaveBeenCalledTimes(1)
	})
})

export {}
