import { TestComp } from '../components/TestComp/TestComp'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { FC, useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ItemProps {
	count: number
}
const Item: FC<ItemProps> = ({ count }) => {
	return <p>{count}</p>
}

const ItemTwo = () => {
	useEffect(() => {
		console.log('rerendered ItemTwo')
	}, [])
	return <p>Count:</p>
}

const ExamplePage: NextPage = () => {
	const [count, setCount] = useState(0)
	const handleClick = useCallback(() => {
		return setCount((prev) => prev + 1)
	}, [])
	return (
		<>
			<ItemTwo />
			<Item count={count} />
			<button onClick={handleClick}>click</button>
		</>
	)
}

export default ExamplePage
