import Table, {
  BankNameCell,
  CreateButtonTable,
  DateCell,
  TextCell,
} from "app/core/components/Table"

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
import { useDisclosure } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createBankQuery from "../mutations/createBankQuery"
import deleteBankQuery from "../mutations/deleteBankQuery"
import updateBankQuery from "../mutations/updateBankQuery"
import { BankQueryForm } from "./BankQueryForm"
import getBankQueries from "../queries/getBankQueries"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import { toast } from "app/pages/_app"
import BankNameDetails from "./BankNameDetails"

const BankQuery = () => {
  const enquiryId = useParam("enquiryId", "number")
  const router = useRouter()

  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10

  const [createBankQueryMutation] = useMutation(createBankQuery, {
    onSuccess() {
      toast({
        title: "Created",
        status: "success",
        isClosable: true,
      })
    },
    onError() {
      toast({
        title: "Failed to Create",
        status: "error",
        isClosable: true,
      })
    },
  })
  const [updateBankQueryMutation] = useMutation(updateBankQuery, {
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
  const [deleteBankQueryMutation, { isLoading }] = useMutation(deleteBankQuery, {
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

  const [data, { refetch }] = useQuery(getBankQueries, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      bank_query: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
      enquiryId: enquiryId,
    },
  })
  const session = useAuthenticatedSession()

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
      header: "Bank Query",
      accessorKey: "bank_query",
      cell: TextCell,
    },
    {
      header: "Our Response",
      accessorKey: "our_response",
      cell: TextCell,
    },
    {
      header: "remark",
      accessorKey: "remark",
      cell: TextCell,
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
            await deleteBankQueryMutation(row.original)
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
      <BankNameDetails />
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
        title="Bank Query"
        data={data.bankQueries}
        columns={columns}
      />

      <DrawerForm isOpen={isOpen} firstField={firstField} onClose={onClose} title="Bank Query">
        <BankQueryForm
          submitText="Create Bank Query"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateBankQuery}
          initialValues={Edit}
          onSubmit={async (values) => {
            try {
              if (values.id) {
                await updateBankQueryMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                })
              } else {
                await createBankQueryMutation({
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

export default BankQuery
