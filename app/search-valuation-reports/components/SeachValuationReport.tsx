import React from "react"
import {
  getQueryKey,
  queryClient,
  useAuthenticatedSession,
  useMutation,
  useParam,
  useQuery,
  useRouter,
  useSession,
} from "blitz"
import { Button } from "app/core/components/Button"
import { AddIcon } from "@chakra-ui/icons"
import Table, {
  CreateButtonTable,
  DateCell,
  DownloadCell,
  StatusPillCell,
} from "app/core/components/Table"

import { useDisclosure } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createSearchValuationReport from "../mutations/createSearchValuationReport"
import deleteSearchValuationReport from "../mutations/deleteSearchValuationReport"
import updateSearchValuationReport from "../mutations/updateSearchValuationReport"
import { SearchValuationReportForm } from "./SearchValuationReportForm"
import getSearchValuationReports from "../queries/getSearchValuationReports"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import { toast } from "app/pages/_app"

const SearchValuationReport = () => {
  const enquiryId = useParam("enquiryId", "number")
  const router = useRouter()

  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10
  const session = useAuthenticatedSession()

  const [createSearchValuationReportMutation] = useMutation(createSearchValuationReport, {
    onSuccess() {
      toast({
        title: "Created",
        status: "success",
        isClosable: true,
      })
    },
    onError() {
      toast({
        title: "Failed to Create.",
        status: "error",
        isClosable: true,
      })
    },
  })
  const [updateSearchValuationReportMutation] = useMutation(updateSearchValuationReport, {
    onSuccess() {
      toast({
        title: "Updated",
        status: "success",
        isClosable: true,
      })
    },
    onError() {
      toast({
        title: "Failed to Updated",
        status: "error",
        isClosable: true,
      })
    },
  })
  const [deleteSearchValuationReportMutation, { isLoading }] = useMutation(
    deleteSearchValuationReport,
    {
      onSuccess() {
        toast({
          title: "Deleted",
          status: "success",
          isClosable: true,
        })
      },
      onError() {
        toast({
          title: "Failed to Delete.",
          status: "error",
          isClosable: true,
        })
      },
    }
  )
  const [Edit, setEdit] = React.useState()

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      refetch()
    },
  })

  const [data, { refetch }] = useQuery(getSearchValuationReports, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      enquiryId: enquiryId,
      document: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
    },
  })

  const onRefreshData = async () => {
    const queryKey = getQueryKey(getLogs, {
      where: {
        enquiryId: enquiryId,
      },
    })
    await queryClient.invalidateQueries(queryKey)
    await refetch()
  }

  const columns = [
    {
      Header: "Document",
      accessor: "document",
    },
    {
      Header: "Status",
      accessor: "file",
      Cell: StatusPillCell,
    },
    {
      Header: "Download",
      accessor: "file",
      id: "id",
      Cell: DownloadCell,
    },
    {
      Header: "Upload on",
      accessor: "updatedAt",
      Cell: DateCell,
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <ActionComponent
          session={session}
          isDeleting={isLoading}
          onDelete={async () => {
            await deleteSearchValuationReportMutation(row.original)
            await onRefreshData()
          }}
          onEdit={() => {
            setEdit(row.original)
            onOpen()
          }}
        />
      ),
    },
  ].slice(0, !["USER", "PARTNER"].includes(session.role as string) ? undefined : -1)

  return (
    <div>
      <Table
        count={data.count}
        hasMore={data.hasMore}
        title="Search And Valuation"
        rightRender={() => (
          <CreateButtonTable
            session={session}
            allowRoles={["ADMIN", "STAFF"]}
            title="Add New"
            onClick={onOpen}
          />
        )}
        data={data.searchValuationReports}
        columns={columns}
      />

      <DrawerForm
        isOpen={isOpen}
        firstField={firstField}
        onClose={onClose}
        title="Search & Valuation"
      >
        <SearchValuationReportForm
          submitText="Add New"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateSearchValuationReport}
          initialValues={Edit}
          onSubmit={async (values) => {
            try {
              if (values.id) {
                await updateSearchValuationReportMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                })
              } else {
                await createSearchValuationReportMutation({
                  ...values,
                  client_name: "",
                  enquiryId: enquiryId,
                  remark: values?.remark ? values?.remark : "",
                })
              }
              onClose()
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            } finally {
              await onRefreshData()
            }
          }}
        />
      </DrawerForm>
    </div>
  )
}

export default SearchValuationReport
