import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createUser from "app/users/mutations/createUser"
import { UserForm, FORM_ERROR } from "app/users/components/UserForm"

const NewUserPage: BlitzPage = () => {
  const router = useRouter()
  const [createUserMutation] = useMutation(createUser)

  return (
    <div className="max-w-5xl mx-auto">
      <h1>Create New User</h1>

      <UserForm
        submitText="Create User"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateUser}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const token = await createUserMutation({ ...values, role: values?.role?.value })
            console.log({ token })
            router.push(Routes.ResultUserPage({ token }))
          } catch (error: any) {
            console.log(error)
            console.log(error.meta?.target)
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else if (
              error.code === "invalid_enum_value" &&
              error.meta?.target?.includes("role")
            ) {
              console.log("working")
              return { role: "Please select role" }
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
NewUserPage.getLayout = (page) => <Layout title={"Create New User"}>{page}</Layout>

export default NewUserPage
