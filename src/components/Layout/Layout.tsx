import s from './Layout.module.scss'
import { Container } from '@/components/UI/Container/Container'
import { LogoIcon } from '@/icons/LogoIcon'

export const Layout = () => {
	return (
		<Container
			styles={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div style={{ width: '30px', height: '30px' }}>
				<LogoIcon />
			</div>
			<p className={s.title}>SpendSmartly</p>
		</Container>
	)
}
