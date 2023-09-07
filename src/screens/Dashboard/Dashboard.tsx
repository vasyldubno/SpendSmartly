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
import { useEffect, useState } from 'react'
import { Expense } from './Dashboard.interface'
import { Balance } from '@/components/Balance/Balance'
import { Chart } from '@/components/Chart/Chart'
import { Expenses } from '@/components/Expenses/Expenses'
import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { Header } from '@/components/Header/Header'
import { Divider } from '@/components/UI/Divider/Divider'
import { PROJECT_NAME } from '@/config/consts'
import { db } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { firebaseService } from '@/services/firebaseService'

export const Dashboard = () => {
	const [expenses, setExpenses] = useState<Expense[]>([])
	const [incomes, setIncomes] = useState<Expense[]>([])
	const [balance, setBalance] = useState<number>(0)
	const [startDateExpenses, setStartDateExpenses] = useState<Date>(
		startOfMonth(new Date())
	)
	const [endDateExpenses, setEndDateExpenses] = useState<Date>(new Date())
	const [startDateIncomes, setStartDateIncomes] = useState<Date>(
		startOfMonth(new Date())
	)
	const [endDateIncomes, setEndDateIncomes] = useState<Date>(new Date())

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
			where('date', '>=', startOfDay(startDateExpenses)),
			where('date', '<=', lastDayOfMonth(endDateExpenses))
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

		const docRefIncomes = query(
			collection(db, `users/${userId}/incomes`),
			where('date', '>=', startOfDay(startDateIncomes)),
			where('date', '<=', lastDayOfMonth(endDateIncomes))
		)
		const incomeSnapshot = onSnapshot(
			docRefIncomes,
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

				setIncomes(categoriesSum)
			},
			(error) => {
				console.log(error)
			}
		)

		return () => {
			expenseSnapshot()
			incomeSnapshot()
		}
	}, [userId])

	useEffect(() => {
		firebaseService.getBalance(userId, setBalance)
	}, [userId, expenses])

	useEffect(() => {
		firebaseService
			.fetchItemsByDate('expenses', startDateExpenses, endDateExpenses)
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
	}, [startDateExpenses, endDateExpenses])

	useEffect(() => {
		firebaseService
			.fetchItemsByDate('incomes', startDateIncomes, endDateIncomes)
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

				setIncomes(categoriesSum)
			})
	}, [startDateIncomes, endDateIncomes])

	return (
		<>
			{authUser && !isLoading ? (
				<div style={{ paddingBottom: '2rem' }}>
					<HeadLayout title={`Dashboard | ${PROJECT_NAME}`} />
					<Header />
					<Balance balance={balance} />
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '2rem',
							marginTop: '1rem',
						}}
					>
						<div>
							<Expenses
								list={expenses}
								startDate={startDateExpenses}
								endDate={endDateExpenses}
								setStartDate={setStartDateExpenses}
								setEndDate={setEndDateExpenses}
								title="My Expenses"
								collection="expenses"
							/>
							{expenses.length > 0 && (
								<Chart list={expenses} label="Expenses" />
							)}
						</div>

						<Divider />

						<div>
							<Expenses
								list={incomes}
								startDate={startDateIncomes}
								endDate={endDateIncomes}
								setStartDate={setStartDateIncomes}
								setEndDate={setEndDateIncomes}
								title="My Incomes"
								collection="incomes"
							/>
							{incomes.length > 0 && <Chart list={incomes} label="Incomes" />}
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}
