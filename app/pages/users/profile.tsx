import { Suspense } from "react"
import { Head, useQuery, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FORM_ERROR } from "app/users/components/UserForm"

import { ProfileUser } from "app/auth/validations"
import { ProfileForm } from "app/users/components/ProfileForm"
import getCurrentUser from "app/users/queries/getCurrentUser"
import updateProfile from "app/users/mutations/updateProfile"
import Loading from "app/core/components/Loading"
import { toast } from "../_app"

export const EditUser = () => {
  const [user, { setQueryData }] = useQuery(getCurrentUser, null, {
    refetchOnWindowFocus: false,
  })
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
              toast({
                title: "Updated Profile",
                status: "success",
                isClosable: true,
              })
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
      <Suspense fallback={<Loading />}>
        <EditUser />
      </Suspense>
    </div>
  )
}

ProfileUserEdit.authenticate = { redirectTo: Routes.LoginPage() }
ProfileUserEdit.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default ProfileUserEdit
