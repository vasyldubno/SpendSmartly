import { auth, db } from '../config/firebase'
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter'
import { lastDayOfMonth, startOfDay } from 'date-fns'
import {
	GoogleAuthProvider,
	confirmPasswordReset,
	sendPasswordResetEmail,
	signInWithPopup,
} from 'firebase/auth'
import {
	DocumentData,
	addDoc,
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
import { NextRouter, Router } from 'next/router'
import { Dispatch, SetStateAction } from 'react'

interface Doc extends DocumentData {
	id: string
}

export const fetchCollection = async (collect: string) => {
	try {
		const data = await getDocs(
			query(
				collection(db, `users/${auth.currentUser?.uid as string}/${collect}`),
				orderBy('date', 'desc')
			)
		)
		const result: Doc[] = data.docs.map((item) => {
			return {
				...item.data(),
				id: item.id,
			}
		})
		return result
	} catch (e) {
		return e
	}
}

export const addCategory = async (
	name: string,
	color: string,
	collect: string
) => {
	await addDoc(
		collection(
			db,
			`users/${
				auth.currentUser?.uid as string
			}/categories${capitalizeFirstLetter(collect)}s`
		),
		{ name, color }
	)
}

export const fetchCategoryItems = async (category: string, userId: string) => {
	const docRef = query(
		collection(db, `users/${userId}/expenses`),
		where('category', '==', `${category}`)
	)
	const result = await getDocs(docRef)
	return result
}

export const firebaseService = {
	forgotPassword: (email: string) => {
		return sendPasswordResetEmail(auth, email)
	},

	resetPassword: (oobCode: string, password: string) => {
		return confirmPasswordReset(auth, oobCode, password)
	},

	fetchItemsByDate: async (collect: string, startDate: Date, endDate: Date) => {
		const docsRef = query(
			collection(db, `users/${auth.currentUser?.uid}/${collect}`),
			where('date', '>=', startOfDay(startDate)),
			where('date', '<=', lastDayOfMonth(endDate))
		)
		const response = await getDocs(docsRef)
		return response.docs.map((item) => {
			return item.data()
		})
	},

	getBalance: async (
		userId: string,
		setState: Dispatch<SetStateAction<number>>
	) => {
		const settingsRef = collection(db, `users/${userId}/settings`)
		await getDocs(settingsRef).then((res) => {
			res.forEach((item) => {
				const { id } = item
				const docRef = doc(db, `users/${userId}/settings`, id)
				const un = onSnapshot(docRef, (snapshot) => {
					const result = snapshot.data() as {
						currency: string
						balance: number
					}
					if (result !== undefined) {
						setState(result.balance)
					}
				})
				return () => un()
			})
		})
	},

	changeCurrency: async (newCurrency: string, userId: string) => {
		await getDocs(collection(db, `users/${userId}/settings`))
			.then(async (res) => {
				const id = res.docs.map((doc) => doc.id)
				await updateDoc(doc(db, `users/${userId}/settings`, ...id), {
					currency: newCurrency,
				})
			})
			.catch((error: string) => {
				throw Error(error)
			})
	},

	handleGoogleAuth: async (router: NextRouter) => {
		await signInWithPopup(auth, new GoogleAuthProvider()).then(
			async (credentials) => {
				const settings = await getDocs(
					collection(db, `users/${credentials.user.uid}/settings`)
				)
				const exist = settings.size
				if (exist === 0) {
					await addDoc(
						collection(db, `users/${credentials.user.uid}/settings`),
						{
							currency: 'USD',
							balance: 0,
						}
					).then(() => {
						return router.push('/dashboard')
					})
				}
				if (exist > 0) {
					return router.push('/dashboard')
				}
			}
		)
	},
}
