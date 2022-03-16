import { BlitzPage, useRouterQuery, Link, useMutation, Routes, Image } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ResetPassword } from "app/auth/validations"
import welcomePassword from "../mutations/welcomePassword"
import logout from "../mutations/logout"
import logo from "public/logo.png"
import { useEffect } from "react"
const WelcomePasswordPage: BlitzPage = () => {
  const query = useRouterQuery()
  const [welcomePasswordMutation, { isSuccess }] = useMutation(welcomePassword)
  const [logoutPasswordMutation] = useMutation(logout)

  useEffect(() => {
    logoutPasswordMutation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="max-w-sm">
        <Image src={logo} alt="logo" />
      </div>
      <h1 className="text-center text-2xl py-2 font-bold">Welcome to Kred Partner</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Enter Password"
          schema={ResetPassword}
          initialValues={{ password: "", passwordConfirmation: "", token: query.token as string }}
          onSubmit={async (values) => {
            try {
              await welcomePasswordMutation(values)
            } catch (error: any) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}
    </div>
  )
}

WelcomePasswordPage.getLayout = (page) => (
  <Layout layout="AuthLayout" title="Reset Your Password">
    {page}
  </Layout>
)

export default WelcomePasswordPage
