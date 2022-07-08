import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Suspense } from "react"
import Loading from "app/core/components/Loading"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <SignupForm onSuccess={() => router.push(Routes.Home())} />
      </Suspense>
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => (
  <Layout layout="AuthLayout" title="Sign Up">
    {page}
  </Layout>
)

export default SignupPage
