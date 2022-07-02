import React from "react"
import {
  getQueryKey,
  queryClient,
  useAuthenticatedSession,
  useMutation,
  useParam,
  useQuery,
  useRouter,
} from "blitz"
import Table, { CreateButtonTable, DateCell, TextCell } from "app/core/components/Table"

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
import { ColumnDef } from "@tanstack/react-table"
import { CreateCaseStatus } from "app/auth/validations"

const CaseStatus = () => {
  const enquiryId = Number(useParam("enquiryId", "number"))

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

  const columns: ColumnDef<any>[] = [
    {
      header: "Bank Name",
      accessorKey: "bank_name",
      cell: TextCell,
    },
    {
      header: "Final Login",
      accessorKey: "final_login",
      cell: ({ getValue }) => (
        <>
          <Tag colorScheme={getValue() ? "green" : "red"}>{getValue() ? "Yes" : "No"}</Tag>
        </>
      ),
    },
    {
      header: "remark",
      accessorKey: "remark",
    },
    {
      header: "Upload on",
      accessorKey: "updatedAt",
      cell: DateCell,
    },
    {
      header: "Action",
      cell: ({ row }) => (
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
          schema={CreateCaseStatus}
          initialValues={Edit}
          onSubmit={async (values) => {
            try {
              if (values.id) {
                await updateCaseStatusMutation({
                  ...values,
                  id: values.id,
                  remark: values?.remark ? values?.remark : "",
                })
              } else {
                await createCaseStatusMutation({
                  ...values,
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
