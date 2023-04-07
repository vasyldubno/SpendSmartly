import { startOfMonth } from 'date-fns'
import { collection, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Expense } from './Dashboard.interface'
import { useAuth } from '@/components/AuthProvider'
import { Balance } from '@/components/Balance/Balance'
import { Chart } from '@/components/Chart'
import { Expenses } from '@/components/Expenses/Expenses'
import { HeadLayout } from '@/components/HeadLayout'
import { Header } from '@/components/Header/Header'
import { db } from '@/config/firebase'
import { firebaseService } from '@/services/firebaseService'

export const Dashboard = () => {
	const [expenses, setExpenses] = useState<Expense[]>([])
	const [balance, setBalance] = useState<number>(0)
	const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()))
	const [endDate, setEndDate] = useState<Date>(new Date())

	const router = useRouter()
	const { authUser, isLoading } = useAuth()
	const userId = authUser?.uid as string

	console.log(authUser)

	useEffect(() => {
		firebaseService.getBalance(userId, setBalance)
	}, [userId, expenses])

	useEffect(() => {
		const expenseSnapshot = onSnapshot(
			collection(db, `users/${userId}/expenses`),
			(snapshot) => {
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
	}, [])

	useEffect(() => {
		if (!authUser) {
			router.push('/')
		}
	}, [authUser])

	useEffect(() => {
		firebaseService
			.fetchItemsByDate('expenses', startDate, endDate)
			.then((res) => {
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
					<HeadLayout />
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
