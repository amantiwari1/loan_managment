import { Suspense } from "react"
import { Head, useQuery, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FORM_ERROR } from "app/users/components/UserForm"
import { notification } from "antd"
import { ProfileUser } from "app/auth/validations"
import { ProfileForm } from "app/users/components/ProfileForm"
import getCurrentUser from "app/users/queries/getCurrentUser"
import updateProfile from "app/users/mutations/updateProfile"

export const EditUser = () => {
  const [user, { setQueryData }] = useQuery(getCurrentUser, null)
  const [updateUserMutation] = useMutation(updateProfile)

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>

      <div>
        <ProfileForm
          submitText="Update Profile"
          schema={ProfileUser}
          initialValues={{ ...user } as any}
          onSubmit={async (values) => {
            try {
              const updated = await updateUserMutation({
                ...values,
              })
              await setQueryData(updated)

              notification.success({ type: "success", message: "Updated Profile" })
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const ProfileUserEdit: BlitzPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <EditUser />
      </Suspense>
    </div>
  )
}

ProfileUserEdit.authenticate = { redirectTo: Routes.LoginPage() }
ProfileUserEdit.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ProfileUserEdit
