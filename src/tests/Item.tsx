import { FC } from 'react'

export const Item: FC = () => {
	const handleClick = () => {
		console.log('Button clicked')
	}

	return (
		<>
			<button onClick={handleClick}>click</button>
		</>
	)
}
