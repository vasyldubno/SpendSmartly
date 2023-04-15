import { checkActionCode } from 'firebase/auth'
import { GetServerSidePropsContext, NextPage } from 'next'
import { auth } from '@/config/firebase'
import { ResetPassword } from '@/screens/ResetPassword/ResetPassword'

interface ResetPasswordPageProps {
	oobCode: string
}

const ResetPasswordPage: NextPage<ResetPasswordPageProps> = ({ oobCode }) => {
	return <ResetPassword oobCode={oobCode} />
}

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const oodCode = context.query.oobCode as string
	const { res } = context

	try {
		await checkActionCode(auth, oodCode)
	} catch (error: any) {
		res.writeHead(301, { location: '/' })
		res.end()
		return {
			props: {},
		}
	}

	return {
		props: {
			oobCode: context.query.oobCode as string,
		},
	}
}

export default ResetPasswordPage
