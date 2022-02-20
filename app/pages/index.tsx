import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Divider, message } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Avatar, AvatarGroup, IconButton, Text, Tooltip } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import getEnquiriesCount from "app/enquiries/queries/getEnquiriesCount"
import { Button } from "app/core/components/Button"
import Table, { BankNameCell, NumberCell } from "app/core/components/Table"
import Loading from "app/core/components/Loading"
import {
  client_occupations_type_options,
  client_service_options,
  exportToCSVWithColumn,
} from "app/common"
import { list_of_bank } from "app/core/data/bank"

const TableColumn = {
  id: "ID",
  createdAt: "Created At",
  updatedAt: "Updated At",
  client_address: "Client Address",
  client_email: "Client Email",
  client_name: "Client Name",
  client_qccupation_type: "Client Occupation Type",
  client_service: "Client Service",
  private_enquiry: "Private Enquiry",
  client_mobile: "Client Mobile",
  loan_amount: "Load Amount",
  enquiry_request: "Rnquiry Request",
  users: "User",
  case_status: "APPLIED BANK NAME",
}

const ITEMS_PER_PAGE = 100

const columns = [
  {
    Header: "Client Name",
    accessor: "client_name",
    Cell: ({ value, row }) => (
      <div>
        <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
          <a className="text-lg font-bold underline hover:text-blue-500">{value}</a>
        </Link>
      </div>
    ),
  },
  {
    Header: "Client Name",
    accessor: "client_service",
    Cell: ({ value }) => <p>{client_service_options[value]}</p>,
  },
  {
    Header: "Amount",
    accessor: "loan_amount",
    Cell: NumberCell,
  },
  {
    Header: "Applied Bank Name",
    accessor: "case_status[0].bank_name",
    Cell: BankNameCell,
  },
  {
    Header: "Case Status",
    // accessor: "loan_amount",
    // Cell: NumberCell,
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
    Header: "Team Members",
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
    Header: "Last Updated on",
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
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                w={100}
                onClick={() => {
                  const ClearEnquires = enquiries.map((arr) => {
                    return {
                      ...arr,
                      users: "",
                      client_service: client_service_options[arr.client_service],
                      client_qccupation_type:
                        client_occupations_type_options[arr.client_qccupation_type],
                      case_status:
                        list_of_bank[arr.case_status[0]?.bank_name] ?? "No Selected Bank",
                    }
                  })
                  exportToCSVWithColumn(ClearEnquires, "Active Enquires", TableColumn)
                }}
              >
                Export CSV
              </Button>
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
            </div>
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
