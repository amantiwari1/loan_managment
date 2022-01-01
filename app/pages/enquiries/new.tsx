import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEnquiry from "app/enquiries/mutations/createEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"
import { Divider } from "antd"

const NewEnquiryPage: BlitzPage = () => {
  const router = useRouter()
  const [createEnquiryMutation] = useMutation(createEnquiry)

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-medium">Create a new Loan Enquiry</h1>
      <Divider />
      <EnquiryForm
        submitText="Create Enquiry"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateEnquiry}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const enquiry = await createEnquiryMutation(values)
            router.push(Routes.ShowEnquiryPage({ enquiryId: enquiry.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      {/* <p>
        <Link href={Routes.EnquiriesPage()}>
          <a>Enquiries</a>
        </Link>
      </p> */}
    </div>
  )
}

NewEnquiryPage.authenticate = true
NewEnquiryPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title={"Create New Enquiry"}>
    {page}
  </Layout>
)

export default NewEnquiryPage
