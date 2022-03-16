import { Link, useRouter, useMutation, BlitzPage, Routes, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEnquiry from "app/enquiries/mutations/createEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"
import { Divider, message } from "antd"
import { CreateEnquiry } from "app/auth/validations"

const NewEnquiryPage: BlitzPage = () => {
  const router = useRouter()
  const [createEnquiryMutation] = useMutation(createEnquiry)
  const session = useSession()

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-medium">Create a new Loan Enquiry</h1>
      <Divider />
      <EnquiryForm
        submitText="Create Enquiry"
        schema={CreateEnquiry}
        onSubmit={async (values: any) => {
          if (!values.isVerifiedPhone) {
            message.error("Please verify your phone number")
            return
          }
          try {
            await createEnquiryMutation(values)
            if (session.role === "ADMIN") {
              router.push(Routes.EnquiryRequestPage())
            }
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("client_email")) {
              return { client_email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }

          try {
          } catch (error: any) {}
        }}
      />
    </div>
  )
}

NewEnquiryPage.authenticate = { redirectTo: Routes.LoginPage() }
NewEnquiryPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title={"Create New Enquiry"}>
    {page}
  </Layout>
)

export default NewEnquiryPage
