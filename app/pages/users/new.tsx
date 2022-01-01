import {
  Link,
  useRouter,
  useMutation,
  BlitzPage,
  Routes,
  formatZodError,
  validateZodSchema,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import createUser from "app/users/mutations/createUser"
import { UserForm, FORM_ERROR } from "app/users/components/UserForm"
import { CreateUserVALIDATION } from "app/users/mutations/validations"

const NewUserPage: BlitzPage = () => {
  const router = useRouter()
  const [createUserMutation] = useMutation(createUser)

  return (
    <div className="max-w-5xl mx-auto">
      <h1>Create New User</h1>

      <UserForm
        submitText="Invite User"
        schema={CreateUserVALIDATION}
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={async (values) => {
          try {
            const token = await createUserMutation(values)
            router.push(Routes.ResultUserPage({ token }))
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      />
    </div>
  )
}

NewUserPage.authenticate = { redirectTo: Routes.LoginPage() }
NewUserPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title={"Create New User"}>
    {page}
  </Layout>
)

export default NewUserPage
