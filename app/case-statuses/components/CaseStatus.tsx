import { Enquiry } from "@prisma/client"

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
import Table, {
  BankNameCell,
  CreateButtonTable,
  DateCell,
  DownloadCell,
  StatusPillCell,
  TextCell,
} from "app/core/components/Table"

import { useDisclosure, Tag } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import createCaseStatus from "../mutations/createCaseStatus"
import deleteCaseStatus from "../mutations/deleteCaseStatus"
import updateCaseStatus from "../mutations/updateCaseStatus"
import { CaseStatusForm } from "./CaseStatusForm"
import getCaseStatuses from "../queries/getCaseStatuses"
import getLogs from "../../logs/queries/getLogs"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import { toast } from "app/pages/_app"

const CaseStatus = () => {
  const enquiryId = useParam("enquiryId", "number")

  const router = useRouter()

  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10

  const [createCaseStatusMutation] = useMutation(createCaseStatus, {
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
  const [updateCaseStatusMutation] = useMutation(updateCaseStatus, {
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
  const [deleteCaseStatusMutation, { isLoading }] = useMutation(deleteCaseStatus, {
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
        status: "success",
        isClosable: true,
      })
    },
  })
  const [Edit, setEdit] = React.useState()

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {},
  })

  const [data, { refetch }] = useQuery(getCaseStatuses, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      bank_name: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
      enquiryId: enquiryId,
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
  const session = useAuthenticatedSession()

  const columns = [
    {
      Header: "Bank Name",
      accessor: "bank_name",
      Cell: TextCell,
    },
    {
      Header: "Final Login",
      accessor: "final_login",
      Cell: ({ value }) => (
        <>
          <Tag colorScheme={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
        </>
      ),
    },
    {
      Header: "remark",
      accessor: "remark",
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
            await deleteCaseStatusMutation(row.original)
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
        rightRender={() => (
          <CreateButtonTable
            session={session}
            allowRoles={["ADMIN", "STAFF"]}
            title="Add New"
            onClick={onOpen}
          />
        )}
        title="Bank finalization"
        data={data.caseStatuses}
        columns={columns}
      />

      <DrawerForm
        isOpen={isOpen}
        firstField={firstField}
        onClose={onClose}
        title="Add bank finalization"
      >
        <CaseStatusForm
          submitText="Create bank finalization"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateCaseStatus}
          initialValues={Edit}
          onSubmit={async (values) => {
            try {
              if (values.id) {
                await updateCaseStatusMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                })
              } else {
                await createCaseStatusMutation({
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

export default CaseStatus
