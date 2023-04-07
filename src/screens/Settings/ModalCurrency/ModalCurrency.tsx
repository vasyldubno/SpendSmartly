import { FC, SetStateAction, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { ModalBasic } from '@/components/UI/ModalBasic'
import { firebaseService } from '@/services/firebaseService'
import { Currency } from '@/types/CurrencyType'
import { getListCurrencies } from '@/utils/getListCurrencies'
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material'

interface ModalCurrencyProps {
	open: boolean
	setOpen: (value: SetStateAction<boolean>) => void
	setState: (value: SetStateAction<string>) => void
}

export const ModalCurrency: FC<ModalCurrencyProps> = ({
	open,
	setOpen,
	setState,
}) => {
	const [currenciesList] = useState<Currency[]>(
		Object.values(getListCurrencies())
	)

	const { authUser, setAuthUser } = useAuth()
	const userId = authUser?.uid as string

	return (
		<ModalBasic open={open} onClose={() => setOpen(false)}>
			<FormControl style={{ width: '100%' }}>
				<InputLabel id="demo-simple-select-label">Currency</InputLabel>
				<Select
					label="Currency"
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					onChange={(e: SelectChangeEvent) => {
						setOpen(false)
						firebaseService.changeCurrency(e.target.value, userId)
						setState(e.target.value)
						setAuthUser((prev) => {
							return {
								email: prev?.email as string,
								uid: prev?.uid as string,
								currency: e.target.value,
							}
						})
					}}
				>
					{currenciesList.map((currency) => (
						<MenuItem key={currency.code} value={currency.code}>
							{currency.code} - {currency.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</ModalBasic>
	)
}
