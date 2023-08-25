import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { FC } from 'react'
import { Doughnut } from 'react-chartjs-2'
import s from './Chart.module.scss'
import {
	colorBgDark,
	colorBgLite,
	colorChartLegendDark,
	colorChartLegendLight,
} from '@/config/colors'
import { useTheme } from '@mui/material'
import { Container } from '../UI/Container/Container'

ChartJS.register(ArcElement, Legend, Tooltip)

interface Expense {
	category: string
	totalAmount: number
	color: string
}

interface ChartProps {
	list: Expense[]
	label: string
}

export const Chart: FC<ChartProps> = ({ list, label }) => {
	const theme = useTheme()

	const options = {
		plugins: {
			legend: {
				labels: {
					color:
						theme.palette.mode === 'dark'
							? colorChartLegendDark
							: colorChartLegendLight,
				},
			},
		},
	}

	return (
		<Container className={s.container}>
			<h2 className={s.title}>Stats</h2>
			<div className={s.chart}>
				<Doughnut
					data={{
						labels: list.map((item) => item.category),
						datasets: [
							{
								label,
								data: list.map((item) => item.totalAmount),
								backgroundColor: list.map((item) => item.color),
								borderColor:
									theme.palette.mode === 'dark' ? colorBgDark : colorBgLite,
							},
						],
					}}
					options={options}
				/>
			</div>
		</Container>
	)
}
