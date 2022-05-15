import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"

import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { IconButton, Text } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import Loading from "app/core/components/Loading"
import Table, { NumberCell, DateCell, ClientNameCell } from "app/core/components/Table"
import { toast } from "../_app"

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
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10
  const [{ enquiries, hasMore, count }, { refetch }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      client_name: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
      enquiry_request: "APPROVED",
    },
  })

  const session = useSession()

  return (
    <div>
      {!["USER", "PARTNER"].includes(session.role as string) && <div></div>}
      <Table
        count={count}
        hasMore={hasMore}
        rightRender={() => (
          <IconButton
            aria-label="Search database"
            onClick={async () => {
              await refetch()
              toast({
                title: "Updated",
                status: "success",
                isClosable: true,
              })
            }}
            variant="outline"
            icon={<IoMdRefresh />}
          />
        )}
        columns={columns}
        data={enquiries}
        title="Approved Enquiries"
      />
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
