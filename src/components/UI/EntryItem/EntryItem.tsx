import { format } from 'date-fns'
import { toDate } from 'date-fns/fp'
import {
	deleteDoc,
	doc,
	updateDoc,
	increment,
	getDocs,
	collection,
} from 'firebase/firestore'
import { Dispatch, FC, SetStateAction } from 'react'
import { MdDeleteForever } from 'react-icons/md'
import s from './EntryItem.module.scss'
import { db } from '@/config/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Entry } from '@/types/EntryType'
import { currencyFormatter } from '@/utils/currencyFormatter'
import { Box } from '@mui/material'

interface IncomeItemProps {
	item: Entry
	collection: string
	setIncomeItems: Dispatch<SetStateAction<[] | Entry[]>>
}

export const EntryItem: FC<IncomeItemProps> = ({
	item,
	collection: collect,
	setIncomeItems,
}) => {
	const { authUser } = useAuth()
	const userId = authUser?.uid as string

	const handleClick = async () => {
		const settingDoc = await getDocs(collection(db, `users/${userId}/settings`))
		const settingIds = settingDoc.docs.map((item) => item.id)

		if (settingIds) {
			await deleteDoc(doc(db, `users/${userId}/${collect}`, item.id))

			setIncomeItems((prev) => prev.filter((doc) => doc.id !== item.id))

			if (collect === 'expenses') {
				await updateDoc(doc(db, `users/${userId}/settings`, settingIds[0]), {
					balance: increment(item.amount),
				})
			}

			if (collect === 'incomes') {
				await updateDoc(doc(db, `users/${userId}/settings`, settingIds[0]), {
					balance: increment(-item.amount),
				})
			}
		}
	}

	return (
		<div className={s.wrapper}>
			<div className={s.items}>
				<p className={s.description}>{item.category}</p>
				<div className={s.right}>
					<p className={s.amount}>
						{currencyFormatter(item.amount, authUser?.currency as string)}
					</p>
					<Box
						style={{ height: '1.2rem' }}
						onClick={handleClick}
						data-testid="iconRemove"
					>
						<MdDeleteForever className={s.iconRemove} />
					</Box>
				</div>
			</div>
			<p className={s.date}>
				{format(toDate(item.date.seconds * 1000), 'dd.MM.yyyy')}
			</p>
		</div>
	)
}
