import Link from 'next/link'
import s from './LayoutNotAuth.module.scss'
import { colorPurple, colorWhite } from '@/config/colors'
import { LogoIcon } from '@/icons/LogoIcon'
import { ButtonBase } from '../UI/ButtonBase/ButtonBase'
import { Container } from '../UI/Container/Container'

export const LayoutNotAuth = () => {
	return (
		<>
			<Container
				styles={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex' }}>
					<div style={{ width: '30px', height: '30px' }}>
						<LogoIcon />
					</div>
					<h1 className={s.title}>SpendSmartly</h1>
				</div>
				<div>
					<Link href="/login">
						<ButtonBase
							backgroundColor={colorPurple}
							color={colorWhite}
							title="Login"
						/>
					</Link>
				</div>
			</Container>
		</>
	)
}
