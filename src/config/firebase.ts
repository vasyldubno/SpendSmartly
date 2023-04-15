import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
	getFirestore,
	enableIndexedDbPersistence,
	initializeFirestore,
	CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import {
	API_KEY,
	APP_ID,
	AUTH_DOMAIN,
	MESSAGING_SENDER_ID,
	PROJECT_ID,
	STOTAGE_BUCKET,
} from './consts'

const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	projectId: PROJECT_ID,
	storageBucket: STOTAGE_BUCKET,
	messagingSenderId: MESSAGING_SENDER_ID,
	appId: APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
