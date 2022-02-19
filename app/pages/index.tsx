import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Divider, message } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Enquiry, User } from "@prisma/client"
import { Avatar, AvatarGroup, IconButton, Text, Tooltip } from "@chakra-ui/react"
import { ColumnsType } from "antd/lib/table"
import { IoMdRefresh } from "react-icons/io"
import getEnquiriesCount from "app/enquiries/queries/getEnquiriesCount"
import { Button } from "app/core/components/Button"
import { BiUser } from "react-icons/bi"
import Table from "app/core/components/Table"
import Loading from "app/core/components/Loading"

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
    Header: "Client Name",
    accessor: "client_name",
    Cell: ({ value, row }) => (
      <div>
        <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
          <a className="text-lg font-bold underline hover:text-blue-500">{value}</a>
        </Link>
        <p>{Client_Service[row.original.client_service]}</p>
      </div>
    ),
  },
  {
    Header: "Amount",
    accessor: "loan_amount",
    Cell: ({ value }) => <p>{value.toString()}</p>,
  },
  {
    Header: "Channel Partner",
    id: "id",
    accessor: "users",
    Cell: ({ value }) => (
      <Text fontWeight="medium" textTransform="capitalize">
        <div className="space-y-2 font-medium items-center">
          {!value.filter((arr) => arr.user.role === "PARTNER").length && (
            <Text fontWeight="medium">No Partner Selected</Text>
          )}
          <AvatarGroup size="md" max={3}>
            {value
              .filter((arr) => arr.user.role === "PARTNER")
              .map((arr, i) => (
                <Tooltip key={i} label={arr.user.name}>
                  <div>
                    <Avatar name={arr.user.name} />
                  </div>
                </Tooltip>
              ))}
          </AvatarGroup>
        </div>
      </Text>
    ),
  },
  {
    Header: "STAFF",
    accessor: "users",
    Cell: ({ value }) => (
      <Text fontWeight="medium" textTransform="capitalize">
        <div className="space-y-2 font-medium items-center">
          {!value.filter((arr) => arr.user.role === "STAFF").length && (
            <Text fontWeight="medium">No Staff Selected</Text>
          )}
          <AvatarGroup size="md" max={3}>
            {value
              .filter((arr) => arr.user.role === "STAFF")
              .map((arr, i) => (
                <Tooltip key={i} label={arr.user.name}>
                  <div>
                    <Avatar name={arr.user.name} />
                  </div>
                </Tooltip>
              ))}
          </AvatarGroup>
        </div>
      </Text>
    ),
  },
  {
    Header: "Last Updated",
    accessor: "updatedAt",
    Cell: ({ value }) => <p>{new Date(value).toDateString()}</p>,
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cardData.map((item) => (
              <div key={item.name}>
                <Link href={item.link ?? "#"}>
                  <Card hoverable={item.link ? true : false}>
                    <p className="text-gray-500 text-xs">{item.name}</p>
                    <p className="text-xl font-bold">{item.count}</p>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          <Divider />
        </div>
      )}
      <div>
        <Table
          columns={columns}
          data={enquiries}
          rightRender={() => (
            <IconButton
              size="sm"
              aria-label="Search database"
              onClick={async () => {
                await refetch()
                message.success("Updated")
              }}
              variant="outline"
              icon={<IoMdRefresh />}
            />
          )}
          title="Active Enquiries"
        />
      </div>
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
      <Suspense fallback={<Loading />}>
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
