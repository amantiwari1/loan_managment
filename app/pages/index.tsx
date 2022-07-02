import { Link, BlitzPage, Routes, usePaginatedQuery, useRouter, useSession, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Divider } from "@chakra-ui/react"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Avatar, AvatarGroup, Box, IconButton, Text, Tooltip } from "@chakra-ui/react"
import { IoMdRefresh } from "react-icons/io"
import getEnquiriesCount from "app/enquiries/queries/getEnquiriesCount"
import { Button } from "app/core/components/Button"
import Table, {
  BankNameCell,
  DateCell,
  NumberCell,
  StatusCaseDashboardCell,
  TextCell,
} from "app/core/components/Table"
import Loading from "app/core/components/Loading"
import {
  client_occupations_type_options,
  client_service_options,
  exportToCSVWithColumn,
} from "app/common"
import { list_of_bank } from "app/core/data/bank"
import { toast } from "./_app"
import { ColumnDef } from "@tanstack/react-table"

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

const columns: ColumnDef<any>[] = [
  {
    header: "Client Name",
    accessorKey: "client_name",
    cell: ({ getValue, row }) => (
      <div>
        <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
          <a className="text-sm font-bold underline hover:text-blue-500">{getValue()}</a>
        </Link>
      </div>
    ),
  },
  {
    header: "Client Name",
    accessorKey: "client_service",
    cell: ({ getValue }) => <Text fontSize="sm">{client_service_options[getValue()]}</Text>,
  },
  {
    header: "Amount",
    accessorKey: "loan_amount",
    cell: NumberCell,
  },
  {
    header: "Location",
    accessorKey: "client_address",
    cell: TextCell,
  },
  {
    header: "Applied Bank Name",
    accessorKey: "case_status[0].bank_name",
    cell: BankNameCell,
  },
  {
    header: "Case Status",
    accessorKey: "case_status[0].case_status",
    id: "case_status",
    cell: StatusCaseDashboardCell,
  },
  {
    header: "Channel Partner",
    id: "id",
    accessorKey: "users",
    cell: ({ getValue }) => (
      <Text fontWeight="medium" textTransform="capitalize">
        <div className="space-y-2 font-medium items-center">
          {!getValue().filter((arr: any) => arr.user.role === "PARTNER").length && (
            <Text fontWeight="medium" fontSize="sm">
              No Partner Selected
            </Text>
          )}
          <AvatarGroup size="xs" max={3}>
            {getValue()
              .filter((arr: any) => arr.user.role === "PARTNER")
              .map((arr: any, i: number) => (
                <Tooltip key={i} label={arr.user.name}>
                  <div>
                    <Avatar size="xs" name={arr.user.name} />
                  </div>
                </Tooltip>
              ))}
          </AvatarGroup>
        </div>
      </Text>
    ),
  },
  {
    header: "Team Members",
    accessorKey: "users",
    cell: ({ getValue }) => (
      <Text fontWeight="medium" textTransform="capitalize">
        <div className="space-y-2 font-medium items-center">
          {!getValue().filter((arr: any) => arr.user.role === "STAFF").length && (
            <Text fontWeight="medium" fontSize="sm">
              No Staff Selected
            </Text>
          )}
          <AvatarGroup size="xs" max={3}>
            {getValue()
              .filter((arr: any) => arr.user.role === "STAFF")
              .map((arr: any, i: number) => (
                <Tooltip key={i} label={arr.user.name}>
                  <div>
                    <Avatar size="xs" name={arr.user.name} />
                  </div>
                </Tooltip>
              ))}
          </AvatarGroup>
        </div>
      </Text>
    ),
  },
  {
    header: "Last Updated on",
    accessorKey: "updatedAt",
    cell: DateCell,
  },
]

export const EnquiriesList = () => {
  const router = useRouter()

  const [count] = useQuery(getEnquiriesCount, {})
  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10

  const [{ enquiries, hasMore, count: serachCount }, { refetch }] = usePaginatedQuery(
    getEnquiries,
    {
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
    }
  )

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

  return (
    <div>
      {!["USER", "PARTNER"].includes(session.role as string) && (
        <div>
          <p className="text-3xl font-bold">Overview</p>
          <Divider my={4} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cardData.map((item) => (
              <div key={item.name}>
                <Link href={item.link ?? "#"}>
                  <Box backgroundColor="white" p={5}>
                    {/* <Card hoverable={item.link ? true : false}> */}
                    <p className="text-gray-500 text-xs">{item.name}</p>
                    <p className="text-xl font-bold">{item.count}</p>
                  </Box>
                </Link>
              </div>
            ))}
          </div>
          <Divider my={4} />
        </div>
      )}
      <div>
        <Table
          count={serachCount}
          hasMore={hasMore}
          columns={columns}
          data={enquiries}
          rightRender={() => (
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                w={100}
                onClick={() => {
                  const ClearEnquires = enquiries.map((arr: any) => {
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
                  toast({
                    title: "Updated",
                    status: "success",
                    isClosable: true,
                  })
                }}
                variant="outline"
                icon={<IoMdRefresh />}
              />
            </div>
          )}
          title="Active Enquiries"
        />
      </div>
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
