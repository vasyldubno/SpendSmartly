import { Register } from '@/components/Register/Register'
import { Container } from '@/components/UI/Container/Container'

const RegisterPage = () => {
	return (
		<Container
			styles={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<h1>Registration</h1>
			<Register />
		</Container>
	)
}

export default RegisterPage
