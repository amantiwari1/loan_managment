import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Divider, Tag } from "antd"
import { Table } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Enquiry } from "@prisma/client"

const ITEMS_PER_PAGE = 100

const Client_Service = {
  HOME_LOAN: "Home Loan",
  MORTGAGE_LOAN: "Mortgage Loan",
  UNSECURED_LOAN: "Unsecured Loan",
  MSME_LOAN: "MSME Loan",
  STARTUP_LOAN: "Startup Loan",
  SUBSIDY_SCHEMES: "Subsidy Schemes",
}

const columns = [
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
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   render: (text) => <Tag color="gold">{text}</Tag>,
  // },
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
/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const cardData = [
  {
    name: "TOTAL ENQUIRIES",
    count: 5,
  },
  {
    name: "ACTIVE ENQUIRIES",
    count: 0,
  },
  {
    name: "REJECTED ENQUIRIES",
    count: 0,
  },
  {
    name: "SANCTIONED ENQUIRIES",
    count: 0,
  },
]

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
      <Table
        columns={columns}
        dataSource={enquiries}
        bordered
        title={() => <p className="text-lg font-bold">Active Enquiries</p>}
      />

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const Home: BlitzPage = () => {
  return (
    <div>
      <p className="text-3xl font-bold">Overview</p>
      <Divider />
      <div className="grid grid-cols-4 gap-5">
        {cardData.map((item) => (
          <Card key={item.name}>
            <p className="text-gray-500 text-xs">{item.name}</p>
            <p className="text-xl font-bold">{item.count}</p>
          </Card>
        ))}
      </div>
      <Divider />

      <Suspense fallback={<div>Loading...</div>}>
        <EnquiriesList />
      </Suspense>
    </div>
  )
}

Home.getLayout = (page) => (
  <Layout layout="DashboardLayout" title="Home">
    {page}
  </Layout>
)
Home.authenticate = { redirectTo: Routes.LoginPage() }

export default Home
