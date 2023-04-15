import { Dispatch, SetStateAction, createContext } from 'react'

export interface AuthUser {
	uid: string
	email: string | null
	currency?: string
}

interface IAuthContext {
	authUser: AuthUser | null
	isLoading: boolean
	signOut: () => void
	signIn: (email: string, password: string) => Promise<string | void | null>
	signUp: (
		email: string,
		password: string,
		displayName: string,
		currency: string
	) => void
	setAuthUser: Dispatch<SetStateAction<AuthUser | null>>
}

export const AuthContext = createContext<IAuthContext>({
	authUser: null,
	isLoading: true,
	signOut: () => {},
	signIn: async (email, password) => {},
	signUp(email, password, displayName, currency) {},
	setAuthUser: () => {},
})
