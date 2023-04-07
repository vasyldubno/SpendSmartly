import { DocumentData } from 'firebase/firestore'
import { FC, useState } from 'react'
import s from './ExpenseItem.module.scss'
import { useAuth } from '@/components/AuthProvider'
import { EntryItem } from '@/components/UI/EntryItem/EntryItem'
import { ModalBasic } from '@/components/UI/ModalBasic'
import { fetchCategoryItems } from '@/services/firebaseService'
import { Entry } from '@/types/EntryType'
import { currencyFormatter } from '@/utils/currencyFormatter'

interface Expense {
	category: string
	totalAmount: number
	color: string
}

interface ExpenseItemProps {
	item: Expense
}

export const ExpenseItem: FC<ExpenseItemProps> = ({ item }) => {
	const [open, setOpen] = useState<boolean>(false)
	const [listExpenses, setListExpenses] = useState<Entry[]>([])

	const { authUser } = useAuth()

	const handleClick = async () => {
		setOpen(true)
		await fetchCategoryItems(item.category, authUser?.uid as string)
			.then((res) => {
				return res.docs.map((item) => {
					return { ...item.data(), id: item.id }
				}) as Entry[]
			})
			.then((res) => setListExpenses(res))
	}

	return (
		<>
			<div
				className={s.wrapper}
				onClick={handleClick}
				onKeyUp={handleClick}
				aria-label={`Get history of category ${item.category}`}
				tabIndex={0}
				role="button"
			>
				<div className={s.left}>
					<div
						className={s.picker}
						style={{ backgroundColor: `${item.color}` }}
					/>
					<p>{item.category}</p>
				</div>
				<p>
					{currencyFormatter(item.totalAmount, authUser?.currency as string)}
				</p>
			</div>
			<ModalBasic
				open={open && listExpenses.length > 0}
				onClose={() => {
					setOpen(false)
					setListExpenses([])
				}}
			>
				{listExpenses.length > 0 &&
					listExpenses.map((expense) => (
						<EntryItem
							key={expense.id}
							item={expense}
							setIncomeItems={setListExpenses}
							collection="expenses"
						/>
					))}
			</ModalBasic>
		</>
	)
}
