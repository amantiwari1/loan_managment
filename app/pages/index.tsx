import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Divider, message, Tag } from "antd"
import { Table } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Enquiry } from "@prisma/client"
import { IconButton, Text } from "@chakra-ui/react"
import { ColumnsType } from "antd/lib/table"
import { IoMdRefresh } from "react-icons/io"
import getEnquiriesCount from "app/enquiries/queries/getEnquiriesCount"
import { Button } from "app/core/components/Button"

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
          <a className="text-lg font-bold underline hover:text-blue-500">{text}</a>
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
  {
    title: "Action",
    dataIndex: "id",
    key: "id",
    render: (id) => (
      <Link href={Routes.ShowEnquiryPage({ enquiryId: id })}>
        <Button variant="outline" w={20}>
          View
        </Button>
      </Link>
    ),
  },
]

export const EnquiriesList = () => {
  const router = useRouter()

  const [count] = useQuery(getEnquiriesCount, {})
  const page = Number(router.query.page) || 0
  const [{ enquiries, hasMore }, { refetch }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      enquiry_request: "APPROVED",
    },
  })

  const cardData = [
    {
      name: "TOTAL ENQUIRIES",
      count: count.active + count.reject + count.sanction + count.pending,
    },
    {
      name: "ACTIVE ENQUIRIES",
      count: count.active,
      link: "/enquiries/approved",
    },
    {
      name: "REJECTED ENQUIRIES",
      count: count.reject,
      link: "/enquiries/rejected",
    },
    {
      name: "SANCTIONED ENQUIRIES",
      count: count.sanction,
      link: "/enquiries/sanctioned",
    },
    {
      name: "REQUEST ENQUIRIES",
      count: count.pending,
      link: "/enquiries/request",
    },
  ]
  const session = useSession()

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      {!["USER", "PARTNER"].includes(session.role as string) && (
        <div>
          <p className="text-3xl font-bold">Overview</p>
          <Divider />
          <div className="grid grid-cols-5 gap-5">
            {cardData.map((item) => (
              <Card key={item.name}>
                {item.link ? (
                  <p className="text-gray-500 text-xs">
                    <span className="mr-1">{item.name}</span>
                    <span>
                      {"( "}
                      <Link href={item.link}>
                        <a className="underline hover:underline hover:text-blue-500">View</a>
                      </Link>
                      {" )"}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-500 text-xs">{item.name}</p>
                )}
                <p className="text-xl font-bold">{item.count}</p>
              </Card>
            ))}
          </div>
          <Divider />
        </div>
      )}
      <Table
        columns={columns}
        dataSource={enquiries}
        bordered
        title={() => (
          <div className="flex justify-between">
            <Text fontWeight="bold">Active Enquiries</Text>
            <IconButton
              aria-label="Search database"
              onClick={async () => {
                await refetch()
                message.success("Updated")
              }}
              variant="outline"
              icon={<IoMdRefresh />}
            />
          </div>
        )}
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

const Home: BlitzPage = () => {
  return (
    <div>
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
