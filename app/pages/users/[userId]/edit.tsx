import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUser from "app/users/queries/getUser"
import updateUser from "app/users/mutations/updateUser"
import { UserForm, FORM_ERROR } from "app/users/components/UserForm"

import { Button } from "app/core/components/Button"
import deleteUser from "app/users/mutations/deleteUser"
import Loading from "app/core/components/Loading"

import { UpdateUser } from "app/auth/validations"
import { toast } from "app/pages/_app"

const options = {
  USER: "Customer",
  PARTNER: "Partner",
  STAFF: "Staff",
  ADMIN: "Admin",
}

export const EditUser = () => {
  const userId = useParam("userId", "number")
  const [user, { setQueryData }] = useQuery(
    getUser,
    { id: userId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateUserMutation] = useMutation(updateUser)
  const [deleteUserMutation] = useMutation(deleteUser)
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Edit User {user.id}</title>
      </Head>

      <div>
        <UserForm
          submitText="Update User"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={UpdateUser}
          initialValues={{ ...user } as any}
          onSubmit={async (values) => {
            try {
              const updated = await updateUserMutation({
                id: user.id,
                ...values,
              })
              await setQueryData(updated)

              toast({
                title: "Updated User",
                status: "success",
                isClosable: true,
              })

              router.push(Routes.UsersPage({ userId: values.role }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />

        <Button
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteUserMutation({ id: user.id })
              router.push(Routes.UsersPage({ userId: user.role }))
            }
          }}
        >
          Delete
        </Button>
      </div>
    </>
  )
}

const EditUserPage: BlitzPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Suspense fallback={<Loading />}>
        <EditUser />
      </Suspense>
    </div>
  )
}

EditUserPage.authenticate = { redirectTo: Routes.LoginPage() }
EditUserPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default EditUserPage
