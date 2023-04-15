import { HeadLayout } from '@/components/HeadLayout/HeadLayout'
import { PROJECT_NAME } from '@/config/consts'
import { RegisterScreen } from '@/screens/RegisterScreen/RegisterScreen'

const RegisterPage = () => {
	return (
		<>
			<HeadLayout title={`Registration | ${PROJECT_NAME}`} />
			<RegisterScreen />
		</>
	)
}

export default RegisterPage
