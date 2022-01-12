import { useRouter, BlitzPage, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import isSignup from "../queries/isSignup"
import { Suspense } from "react"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
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
