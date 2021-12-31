import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import deleteEnquiry from "app/enquiries/mutations/deleteEnquiry"

export const Enquiry = () => {
  const router = useRouter()
  const enquiryId = useParam("enquiryId", "number")
  const [deleteEnquiryMutation] = useMutation(deleteEnquiry)
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })

  return (
    <>
      <Head>
        <title>Enquiry {enquiry.id}</title>
      </Head>

      <div>
        <h1>Enquiry {enquiry.id}</h1>
        <pre>{JSON.stringify(enquiry, null, 2)}</pre>

        <Link href={Routes.EditEnquiryPage({ enquiryId: enquiry.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteEnquiryMutation({ id: enquiry.id })
              router.push(Routes.EnquiriesPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowEnquiryPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.EnquiriesPage()}>
          <a>Enquiries</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Enquiry />
      </Suspense>
    </div>
  )
}

ShowEnquiryPage.authenticate = { redirectTo: Routes.LoginPage() }
ShowEnquiryPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowEnquiryPage
