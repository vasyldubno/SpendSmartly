import { useAuth } from '../AuthProvider'
import { Modal } from '../Modal/Modal'
import { FC, useEffect, useState } from 'react'
import s from './Balance.module.scss'
import { colorGreen, colorRed } from '@/config/colors'
import { LogoIcon } from '@/icons/LogoIcon'
import { currencyFormatter } from '@/utils/currencyFormatter'
import { ButtonUI } from '../UI/Button/Button'
import { Container } from '../UI/Container/Container'

interface BalanceProps {
	balance: number
}

export const Balance: FC<BalanceProps> = ({ balance }) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [selectedCollection, setSelectedCollection] = useState<string>('')
	const [totalBalance, setTotalBalance] = useState('')

	const { authUser } = useAuth()

	const handleClick = (collection: string) => {
		setModalOpen(true)
		setSelectedCollection(collection)
	}

	useEffect(() => {
		if (authUser) {
			setTotalBalance(currencyFormatter(balance, authUser.currency as string))
		}
	}, [authUser, balance])

	return (
		<Container
			styles={{ marginBottom: '2rem', marginTop: '2rem', display: 'flex' }}
		>
			<section className={s.sectionCurrency}>
				<p>Account Balance</p>
				<p>{totalBalance}</p>
			</section>
			<section className={s.sectionButtons}>
				<ButtonUI
					title="ADD EXPENSE"
					color={colorRed}
					onClick={() => handleClick('expenses')}
				/>
				<ButtonUI
					title="ADD INCOME"
					color={colorGreen}
					onClick={() => handleClick('incomes')}
				/>
			</section>
			<Modal
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				selectedCollection={selectedCollection}
			/>
		</Container>
	)
}
