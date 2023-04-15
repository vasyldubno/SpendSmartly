import { sendPasswordResetEmail } from 'firebase/auth'
import { firebaseService } from './firebaseService'
import { auth } from '@/config/firebase'

jest.mock('firebase/firestore', () => ({
	getFirestore: jest.fn(),
	collection: jest.fn(),
	orderBy: jest.fn(),
	query: jest.fn(),
	where: jest.fn(),
	getDocs: () => ({
		docs: [
			{
				data: jest.fn(() => ({ name: 'doc1', date: new Date(2023, 3, 9) })),
				id: 'doc1-id',
			},
			{
				data: jest.fn(() => ({ name: 'doc2', date: new Date(2023, 3, 8) })),
				id: 'doc2-id',
			},
		],
	}),
}))

jest.mock('firebase/auth', () => ({
	sendPasswordResetEmail: jest.fn(),
	getAuth: () => ({
		currenctUser: {
			uid: 'asdffghjkl',
		},
	}),
}))

describe('firebaseService', () => {
	it('fetchCollection', async () => {
		const result = await firebaseService.fetchCollection('incomes')
		expect(result).toEqual([
			{ name: 'doc1', date: new Date(2023, 3, 9), id: 'doc1-id' },
			{ name: 'doc2', date: new Date(2023, 3, 8), id: 'doc2-id' },
		])
	})

	it('forgotPassword', () => {
		const email = 'test@example.com'
		firebaseService.forgotPassword(email)
		expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, email)
	})
})

export {}
