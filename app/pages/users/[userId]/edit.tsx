import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUser from "app/users/queries/getUser"
import updateUser from "app/users/mutations/updateUser"
import { UserForm, FORM_ERROR } from "app/users/components/UserForm"
import { notification } from "antd"
import { Button } from "app/core/components/Button"
import deleteUser from "app/users/mutations/deleteUser"

import dynamic from "next/dynamic"
const Popconfirm = dynamic(() => import("antd/lib/popconfirm"), {
  ssr: false,
})

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
          // schema={UpdateUser}
          initialValues={{ ...user, role: { value: user.role, label: options[user.role] } }}
          onSubmit={async (values) => {
            try {
              const updated = await updateUserMutation({
                id: user.id,
                ...values,
              })
              await setQueryData(updated)
              notification.success({ type: "success", message: "Updated User" })
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
      <Suspense fallback={<div>Loading...</div>}>
        <EditUser />
      </Suspense>
    </div>
  )
}

EditUserPage.authenticate = { redirectTo: Routes.LoginPage() }
EditUserPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default EditUserPage
