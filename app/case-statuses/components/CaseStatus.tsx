import { Enquiry } from "@prisma/client"
import { message } from "antd"
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
import Table, {
  CreateButtonTable,
  DateCell,
  DownloadCell,
  StatusPillCell,
} from "app/core/components/Table"

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { useDisclosure, Tag } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import createCaseStatus from "../mutations/createCaseStatus"
import deleteCaseStatus from "../mutations/deleteCaseStatus"
import updateCaseStatus from "../mutations/updateCaseStatus"
import { CaseStatusForm } from "./CaseStatusForm"
import getCaseStatuses from "../queries/getCaseStatuses"
import getLogs from "../../logs/queries/getLogs"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"

const CaseStatus = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })
  const [createCaseStatusMutation] = useMutation(createCaseStatus, {
    onSuccess() {
      message.success("Created Case")
    },
    onError() {
      message.error("Failed to Create CaseStatus")
    },
  })
  const [updateCaseStatusMutation] = useMutation(updateCaseStatus, {
    onSuccess() {
      message.success("Updated CaseStatus")
    },
    onError() {
      message.error("Failed to Updated CaseStatus")
    },
  })
  const [deleteCaseStatusMutation, { isLoading }] = useMutation(deleteCaseStatus, {
    onSuccess() {
      message.success("Deleted CaseStatus")
    },
    onError() {
      message.error("Failed to Delete CaseStatus")
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

  const [data, { refetch }] = useQuery(getCaseStatuses, {
    where: {
      enquiryId: enquiry.id,
    },
  })

  const onRefreshData = async () => {
    const queryKey = getQueryKey(getLogs, {
      where: {
        enquiryId: enquiry.id,
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
        rightRender={() => (
          <CreateButtonTable
            session={session}
            allowRoles={["ADMIN", "STAFF"]}
            title="Add New Case status"
            onClick={onOpen}
          />
        )}
        title="Case status"
        data={data.caseStatuses}
        columns={columns}
      />

      <DrawerForm
        isOpen={isOpen}
        firstField={firstField}
        onClose={onClose}
        title="Add Project Report"
      >
        <CaseStatusForm
          submitText="Create Case Status"
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

export default CaseStatus
