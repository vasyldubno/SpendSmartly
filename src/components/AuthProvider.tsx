import { auth, db } from '../config/firebase'
import {
	User,
	signOut as authSignOut,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/router'
import {
	FC,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
	Dispatch,
	SetStateAction,
} from 'react'

interface AuthUser {
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

const AuthContext = createContext<IAuthContext>({
	authUser: null,
	isLoading: true,
	signOut: () => {},
	signIn: async (email, password) => {},
	signUp(email, password, displayName, currency) {},
	setAuthUser: () => {},
})

const getCurrency = async (id: string) => {
	const result = await getDocs(collection(db, `users/${id}/settings`))
	const [currency] = result.docs.map((res) => res.data())

	if (currency === undefined) {
		return 'USD' as string
	}
	if (currency) {
		return currency.currency as string
	}
}

export const useFirebaseAuth = () => {
	const [authUser, setAuthUser] = useState<AuthUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const router = useRouter()

	const authStateChanged = async (user: User | null) => {
		setIsLoading(true)
		if (!user) {
			setAuthUser(null)
			setIsLoading(false)
			return
		}
		const newCurrency = await getCurrency(auth.currentUser?.uid as string)

		setAuthUser({
			uid: user.uid,
			email: user.email,
			currency: newCurrency,
		})
		setIsLoading(false)
	}

	const signOut = () => {
		authSignOut(auth).then(() => {
			setAuthUser(null)
			setIsLoading(false)
		})
	}

	const signIn = (
		email: string,
		password: string
	): Promise<string | void | null> => {
		const result = signInWithEmailAndPassword(auth, email, password)
			.then(async (credentials) => {
				setIsLoading(true)
				const newCurrency = await getCurrency(auth.currentUser?.email as string)
				setAuthUser({
					uid: credentials.user.uid,
					email: credentials.user.email,
					currency: newCurrency,
				})
				setIsLoading(false)
				router.push('/dashboard')
			})
			.catch((error: Error): string | null => {
				console.log('error.message AuthProvider', error.message)
				if (error.message === 'Firebase: Error (auth/user-not-found).') {
					return `Don't exist user with email ${email}`
				}
				if (error.message === 'Firebase: Error (auth/wrong-password).') {
					return `Don't match password with email ${email}`
				}
				if (error.message) {
					return error.message
				}
				return null
			})
		return result
	}

	const signUp = (
		email: string,
		password: string,
		displayName: string,
		currency: string
	) => {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (credentials) => {
				setAuthUser({
					email: credentials.user.email,
					uid: credentials.user.uid,
				})

				if (auth.currentUser !== null) {
					updateProfile(auth.currentUser, { displayName }).catch(
						(error: Error) => console.log(error.message)
					)
					await addDoc(
						collection(db, `users/${credentials.user.uid}/settings`),
						{ currency, balance: 0 }
					).then(() => {
						setAuthUser((prev) => ({
							email: prev?.email as string,
							uid: prev?.uid as string,
							currency,
						}))
					})
				}
				router.push('/dashboard')
				setIsLoading(false)
			})
			.catch((error: Error) => console.log(error.message))
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, authStateChanged)
		return () => unsubscribe()
	}, [])

	return {
		authUser,
		isLoading,
		signOut,
		signIn,
		signUp,
		setAuthUser,
	}
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const auth = useFirebaseAuth()
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
