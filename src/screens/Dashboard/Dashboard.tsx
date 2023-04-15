import { lastDayOfMonth, startOfDay, startOfMonth } from 'date-fns'
import {
	DocumentData,
	QuerySnapshot,
	collection,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { Expense } from './Dashboard.interface'
import { Balance } from '@/components/Balance/Balance'
import { Chart } from '@/components/Chart/Chart'
import { Expenses } from '@/components/Expenses/Expenses'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { Header } from '@/components/Header/Header'
import { PROJECT_NAME } from '@/config/consts'
import { db } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { firebaseService } from '@/services/firebaseService'

export const Dashboard = () => {
	const [expenses, setExpenses] = useState<Expense[]>([])
	const [balance, setBalance] = useState<number>(0)
	const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()))
	const [endDate, setEndDate] = useState<Date>(new Date())

	const router = useRouter()
	const { authUser, isLoading } = useAuth()
	const userId = authUser?.uid as string

	useEffect(() => {
		const localUser = localStorage.getItem('authorized') as string
		if (localUser !== 'true') {
			router.push('/')
		}
	}, [])

	useEffect(() => {
		const docRef = query(
			collection(db, `users/${userId}/expenses`),
			where('date', '>=', startOfDay(startDate)),
			where('date', '<=', lastDayOfMonth(endDate))
		)
		const expenseSnapshot = onSnapshot(
			docRef,
			(snapshot: QuerySnapshot<DocumentData>) => {
				const data = snapshot.docs.map((item) => item.data())

				const categoriesSum: Expense[] = []

				data.forEach((item) => {
					const existing = categoriesSum.find(
						(s) => s.category === item.category
					)
					if (existing) {
						existing.totalAmount += item.amount
					} else {
						categoriesSum.push({
							category: item.category as string,
							totalAmount: item.amount as number,
							color: item.color as string,
						})
					}
				})

				setExpenses(categoriesSum)
			},
			(error) => {
				console.log(error)
			}
		)

		return () => {
			expenseSnapshot()
		}
	}, [userId])

	useEffect(() => {
		firebaseService.getBalance(userId, setBalance)
	}, [userId, expenses])

	useEffect(() => {
		firebaseService
			.fetchItemsByDate('expenses', startDate, endDate)
			.then((res: DocumentData[]) => {
				const categoriesSum: Expense[] = []

				res.forEach((item) => {
					const existing = categoriesSum.find(
						(s) => s.category === item.category
					)

					if (existing) {
						existing.totalAmount += item.amount
					} else {
						categoriesSum.push({
							category: item.category as string,
							totalAmount: item.amount as number,
							color: item.color as string,
						})
					}
				})

				setExpenses(categoriesSum)
			})
	}, [startDate, endDate])

	return (
		<>
			{authUser && !isLoading ? (
				<>
					<HeadLayout title={`Dashboard | ${PROJECT_NAME}`} />
					<Header />
					<Balance balance={balance} />
					<Expenses
						list={expenses}
						startDate={startDate}
						endDate={endDate}
						setStartDate={setStartDate}
						setEndDate={setEndDate}
					/>
					{expenses.length > 0 && <Chart list={expenses} />}
				</>
			) : null}
		</>
	)
}
