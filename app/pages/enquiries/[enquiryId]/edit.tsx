import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import updateEnquiry from "app/enquiries/mutations/updateEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"

export const EditEnquiry = () => {
  const router = useRouter()
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry, { setQueryData }] = useQuery(
    getEnquiry,
    { id: enquiryId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateEnquiryMutation] = useMutation(updateEnquiry)

  return (
    <>
      <Head>
        <title>Edit Enquiry {enquiry.id}</title>
      </Head>

      <div>
        <h1>Edit Enquiry {enquiry.id}</h1>
        <pre>{JSON.stringify(enquiry, null, 2)}</pre>

        <EnquiryForm
          submitText="Update Enquiry"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateEnquiry}
          initialValues={enquiry}
          onSubmit={async (values) => {
            try {
              const updated = await updateEnquiryMutation({
                id: enquiry.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowEnquiryPage({ enquiryId: updated.id }))
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

const EditEnquiryPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditEnquiry />
      </Suspense>

      <p>
        <Link href={Routes.EnquiriesPage()}>
          <a>Enquiries</a>
        </Link>
      </p>
    </div>
  )
}

EditEnquiryPage.authenticate = true
EditEnquiryPage.getLayout = (page) => <Layout layout="DashboardLayout">{page}</Layout>

export default EditEnquiryPage
