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
import getEnquiries from "app/enquiries/queries/getEnquiries"
import { Suspense } from "react"
import { IoMdRefresh } from "react-icons/io"
import Loading from "app/core/components/Loading"

import {
  IconButton,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Popover,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { Button } from "app/core/components/Button"
import updateEnquiryRequest from "app/enquiries/mutations/updateEnquiryRequest"
import Table, { DateCell, NumberCell } from "app/core/components/Table"
import { toast } from "../_app"
import { ColumnDef } from "@tanstack/react-table"

const Client_Service: any = {
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
      header: "Client Name",
      accessorKey: "client_name",
      cell: ({ getValue, row }) => (
        <div>
          <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
            <a className="text-lg font-bold">{getValue()}</a>
          </Link>
          <p>{Client_Service[row.original.client_service]}</p>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "loan_amount",
      id: "loan_amount",
      cell: NumberCell,
    },
    {
      header: "Channel Partner",
      accessorKey: "users",
      cell: ({ getValue }) => (
        <Text fontWeight="medium" textTransform="capitalize">
          {getValue().length !== 0 ? getValue()[0]?.user?.name ?? "Not Selected" : "Not Selected"}
        </Text>
      ),
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt",
      id: "updatedAt",
      cell: DateCell,
    },
    {
      header: "Actions",
      accessorKey: "id",
      id: "id",
      cell: ({ getValue }) => (
        <div className="space-x-5">
          <Popover>
            <PopoverTrigger>
              <IconButton
                aria-label="Accept"
                variant="outline"
                isLoading={isLoading}
                colorScheme="Customgreen"
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
                        await updateEnquiryMutation({
                          isNew: true,
                          id: getValue(),
                          enquiry_request: "APPROVED",
                        })

                        router.push(Routes.ShowEnquiryPage({ enquiryId: getValue() }))
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
                          isNew: true,
                          id: getValue(),
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
      enquiry_request: "PENDING",
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
        title="Request Enquiries"
      />
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
