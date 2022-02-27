import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import { message } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { IconButton, Text } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import Loading from "app/core/components/Loading"
import Table, { NumberCell, DateCell, ClientNameCell } from "app/core/components/Table"

const ITEMS_PER_PAGE = 100

const columns = [
  {
    Header: "Client Name",
    accessor: "client_name",
    Cell: ClientNameCell,
  },
  {
    Header: "Amount",
    accessor: "loan_amount",
    key: "loan_amount",
    Cell: NumberCell,
  },
  {
    Header: "Last Updated",
    accessor: "updatedAt",
    key: "updatedAt",
    Cell: DateCell,
  },
]

export const EnquiriesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ enquiries, hasMore }, { refetch }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      enquiry_request: "APPROVED",
    },
  })

  const session = useSession()

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      {!["USER", "PARTNER"].includes(session.role as string) && <div></div>}
      <Table
        rightRender={() => (
          <IconButton
            aria-label="Search database"
            onClick={async () => {
              await refetch()
              message.success("Updated")
            }}
            variant="outline"
            icon={<IoMdRefresh />}
          />
        )}
        columns={columns}
        data={enquiries}
        title="Approved Enquiries"
      />
      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
    </div>
  )
}

const EnquiryApprovedPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <EnquiriesList />
      </Suspense>
    </div>
  )
}

EnquiryApprovedPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title="Enquiries Request">
    {page}
  </Layout>
)
EnquiryApprovedPage.authenticate = { redirectTo: Routes.LoginPage() }

export default EnquiryApprovedPage
