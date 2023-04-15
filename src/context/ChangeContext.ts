import { createContext } from 'react'

type ContextType = {
	changeMode: () => void
}

export const ChangeContext = createContext<ContextType>({
	changeMode: () => {},
})
