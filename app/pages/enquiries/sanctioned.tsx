import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Divider, Tag } from "antd"
import { Table } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Enquiry } from "@prisma/client"
import { Text } from "@chakra-ui/react"
import { ColumnsType } from "antd/lib/table"

const ITEMS_PER_PAGE = 100

const Client_Service = {
  HOME_LOAN: "Home Loan",
  MORTGAGE_LOAN: "Mortgage Loan",
  UNSECURED_LOAN: "Unsecured Loan",
  MSME_LOAN: "MSME Loan",
  STARTUP_LOAN: "Startup Loan",
  SUBSIDY_SCHEMES: "Subsidy Schemes",
}

const columns: ColumnsType<Enquiry> = [
  {
    title: "Client Name",
    dataIndex: "client_name",
    render: (text, data: Enquiry) => (
      <div>
        <Link href={Routes.ShowEnquiryPage({ enquiryId: data.id })}>
          <a className="text-lg font-bold">{text}</a>
        </Link>
        <p>{Client_Service[data.client_service]}</p>
      </div>
    ),
  },
  {
    title: "Amount",
    dataIndex: "loan_amount",

    key: "loan_amount",
    render: (text) => <p>{text.toString()}</p>,
  },
  {
    title: "Channel Partner",
    dataIndex: "users",

    render: (users: any[]) => (
      <Text fontWeight="medium" textTransform="capitalize">
        {users.length !== 0 ? users[0]?.user?.name ?? "Not Selected" : "Not Selected"}
      </Text>
    ),
  },
  // {
  //   title: "Staff",
  //   dataIndex: "staff",
  //   render: (text) => <a>{text}</a>,
  // },
  {
    title: "Last Updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (updatedAt) => <p>{new Date(updatedAt).toDateString()}</p>,
  },
]

export const EnquiriesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ enquiries, hasMore }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      enquiry_request: "SANCTIONED",
    },
  })

  const session = useSession()

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      {!["USER", "PARTNER"].includes(session.role as string) && <div></div>}
      <Table
        columns={columns}
        dataSource={enquiries}
        bordered
        title={() => <Text fontWeight="bold">Sanctioned Enquiries</Text>}
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

const EnquirySanctionedPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EnquiriesList />
      </Suspense>
    </div>
  )
}

EnquirySanctionedPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title="Enquiries Request">
    {page}
  </Layout>
)
EnquirySanctionedPage.authenticate = { redirectTo: Routes.LoginPage() }

export default EnquirySanctionedPage
