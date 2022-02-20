import { message } from "antd"
import Table, { BankNameCell, CreateButtonTable, DateCell } from "app/core/components/Table"

import React from "react"
import {
  getQueryKey,
  queryClient,
  useAuthenticatedSession,
  useMutation,
  useParam,
  useQuery,
  useSession,
} from "blitz"
import { Button } from "app/core/components/Button"
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { useDisclosure } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createBankQuery from "../mutations/createBankQuery"
import deleteBankQuery from "../mutations/deleteBankQuery"
import updateBankQuery from "../mutations/updateBankQuery"
import { BankQueryForm } from "./BankQueryForm"
import getBankQuery from "../queries/getBankQuery"
import getBankQueries from "../queries/getBankQueries"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"

const BankQuery = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })
  const [createBankQueryMutation] = useMutation(createBankQuery, {
    onSuccess() {
      message.success("Created Case")
    },
    onError() {
      message.error("Failed to Create BankQuery")
    },
  })
  const [updateBankQueryMutation] = useMutation(updateBankQuery, {
    onSuccess() {
      message.success("Updated BankQuery")
    },
    onError() {
      message.error("Failed to Updated BankQuery")
    },
  })
  const [deleteBankQueryMutation, { isLoading }] = useMutation(deleteBankQuery, {
    onSuccess() {
      message.success("Deleted BankQuery")
    },
    onError() {
      message.error("Failed to Delete BankQuery")
    },
  })
  const [Edit, setEdit] = React.useState<any>({
    status: "NOT_UPLOAD",
  })

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setEdit({
        status: "NOT_UPLOAD",
      })
    },
  })

  const [data, { refetch }] = useQuery(getBankQueries, {
    where: {
      enquiryId: enquiry.id,
    },
  })
  const session = useAuthenticatedSession()

  const onRefreshData = async () => {
    const queryKey = getQueryKey(getLogs, {
      where: {
        enquiryId: enquiry.id,
      },
    })
    await queryClient.invalidateQueries(queryKey)
    await refetch()
  }

  const columns = [
    {
      Header: "Bank Query",
      accessor: "bank_query",
      Cell: BankNameCell,
    },
    {
      Header: "Our Response",
      accessor: "our_response",
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
      <Table
        rightRender={() => (
          <CreateButtonTable
            session={session}
            allowRoles={["ADMIN", "STAFF"]}
            title="Add New Bank Query"
            onClick={onOpen}
          />
        )}
        title="Bank Query"
        data={data.bankQueries}
        columns={columns}
      />

      <DrawerForm
        isOpen={isOpen}
        firstField={firstField}
        onClose={onClose}
        title="Add Project Report"
      >
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
                  client_name: enquiry.client_name,
                  enquiryId: enquiry.id,
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
