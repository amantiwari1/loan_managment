import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createEnquiry from "app/enquiries/mutations/createEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"

const NewEnquiryPage: BlitzPage = () => {
  const router = useRouter()
  const [createEnquiryMutation] = useMutation(createEnquiry)

  return (
    <div>
      <h1>Create New Enquiry</h1>

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

      <p>
        <Link href={Routes.EnquiriesPage()}>
          <a>Enquiries</a>
        </Link>
      </p>
    </div>
  )
}

NewEnquiryPage.authenticate = { redirectTo: Routes.LoginPage() }
NewEnquiryPage.getLayout = (page) => <Layout title={"Create New Enquiry"}>{page}</Layout>

export default NewEnquiryPage
