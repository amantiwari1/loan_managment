import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getEnquiries from "app/enquiries/queries/getEnquiries"

const ITEMS_PER_PAGE = 100

export const EnquiriesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ enquiries, hasMore }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {enquiries.map((enquiry) => (
          <li key={enquiry.id}>
            <Link href={Routes.ShowEnquiryPage({ enquiryId: enquiry.id })}>
              <a>{enquiry.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const EnquiriesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Enquiries</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewEnquiryPage()}>
            <a>Create Enquiry</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <EnquiriesList />
        </Suspense>
      </div>
    </>
  )
}

EnquiriesPage.authenticate = { redirectTo: Routes.LoginPage() }
EnquiriesPage.getLayout = (page) => <Layout>{page}</Layout>

export default EnquiriesPage
