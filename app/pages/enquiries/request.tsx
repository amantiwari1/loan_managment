import {
  Link,
  BlitzPage,
  Routes,
  usePaginatedQuery,
  useRouter,
  useSession,
  useMutation,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import { message } from "antd"
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { Enquiry } from "@prisma/client"
import { IoMdRefresh } from "react-icons/io"
import Loading from "app/core/components/Loading"

import {
  IconButton,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  Popover,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react"
import { ColumnsType } from "antd/lib/table"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { Button } from "app/core/components/Button"
import updateEnquiryRequest from "app/enquiries/mutations/updateEnquiryRequest"
import { BiRefresh } from "react-icons/bi"
import createUser from "app/users/mutations/createUser"
import Table, { DateCell, NumberCell } from "app/core/components/Table"
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = ""
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

const ITEMS_PER_PAGE = 100

const Client_Service = {
  HOME_LOAN: "Home Loan",
  MORTGAGE_LOAN: "Mortgage Loan",
  UNSECURED_LOAN: "Unsecured Loan",
  MSME_LOAN: "MSME Loan",
  STARTUP_LOAN: "Startup Loan",
  SUBSIDY_SCHEMES: "Subsidy Schemes",
}

export const EnquiriesList = () => {
  const [updateEnquiryMutation, { isLoading }] = useMutation(updateEnquiryRequest)

  const columns = [
    {
      Header: "Client Name",
      accessor: "client_name",
      Cell: ({ value, row }) => (
        <div>
          <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
            <a className="text-lg font-bold">{value}</a>
          </Link>
          <p>{Client_Service[row.original.client_service]}</p>
        </div>
      ),
    },
    {
      Header: "Amount",
      accessor: "loan_amount",
      key: "loan_amount",
      Cell: NumberCell,
    },
    {
      Header: "Channel Partner",
      accessor: "users",
      Cell: ({ value }) => (
        <Text fontWeight="medium" textTransform="capitalize">
          {value.length !== 0 ? value[0]?.user?.name ?? "Not Selected" : "Not Selected"}
        </Text>
      ),
    },
    {
      Header: "Last Updated",
      accessor: "updatedAt",
      key: "updatedAt",
      Cell: DateCell,
    },
    {
      Header: "Actions",
      accessor: "id",
      key: "id",
      Cell: ({ value }) => (
        <div className="space-x-5">
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Accept"
                variant="outline"
                isLoading={isLoading}
                colorScheme="green"
                icon={<CheckIcon />}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Confirmation</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Text>Are you sure you want to approve this enquiry?</Text>
                  <div className="flex justify-end mr-2 mt-1">
                    <Button
                      isLoading={isLoading}
                      onClick={async () => {
                        const token: any = await updateEnquiryMutation({
                          id: value,
                          enquiry_request: "APPROVED",
                        })

                        router.push(Routes.ResultUserPage({ token }))

                        await refetch()
                      }}
                      w={50}
                    >
                      Yes
                    </Button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Accept"
                variant="outline"
                isLoading={isLoading}
                colorScheme="red"
                icon={<CloseIcon />}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Confirmation</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Text>Are you sure you want to reject this enquiry?</Text>
                  <div className="flex justify-end mr-2 mt-1">
                    <Button
                      isLoading={isLoading}
                      onClick={async () => {
                        await updateEnquiryMutation({
                          id: value,
                          enquiry_request: "REJECTED",
                        })

                        await refetch()
                      }}
                      w={50}
                    >
                      Yes
                    </Button>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </div>
      ),
    },
  ]
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ enquiries, hasMore }, { refetch }] = usePaginatedQuery(getEnquiries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      enquiry_request: "PENDING",
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
        title="Request Enquiries"
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

const EnquiryRequestPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <EnquiriesList />
      </Suspense>
    </div>
  )
}

EnquiryRequestPage.getLayout = (page) => (
  <Layout layout="DashboardLayout" title="Enquiries Request">
    {page}
  </Layout>
)
EnquiryRequestPage.authenticate = { redirectTo: Routes.LoginPage() }

export default EnquiryRequestPage
