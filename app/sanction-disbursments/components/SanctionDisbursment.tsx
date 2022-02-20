import { message } from "antd"
import Table, {
  CreateButtonTable,
  DateCell,
  DownloadCell,
  NumberCell,
  StatusPillCell,
} from "app/core/components/Table"

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
import { AddIcon, DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons"
import { useDisclosure, Tag } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createSanctionDisbursment from "../mutations/createSanctionDisbursment"
import deleteSanctionDisbursment from "../mutations/deleteSanctionDisbursment"
import updateSanctionDisbursment from "../mutations/updateSanctionDisbursment"
import { SanctionDisbursmentForm } from "./SanctionDisbursmentForm"
import getSanctionDisbursments from "../queries/getSanctionDisbursments"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import { client_service_options } from "app/common"

const SanctionDisbursment = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })
  const [createSanctionDisbursmentMutation] = useMutation(createSanctionDisbursment, {
    onSuccess() {
      message.success("Created Case")
    },
    onError() {
      message.error("Failed to Create SanctionDisbursment")
    },
  })
  const [updateSanctionDisbursmentMutation] = useMutation(updateSanctionDisbursment, {
    onSuccess() {
      message.success("Updated SanctionDisbursment")
    },
    onError() {
      message.error("Failed to Updated SanctionDisbursment")
    },
  })
  const [deleteSanctionDisbursmentMutation, { isLoading }] = useMutation(
    deleteSanctionDisbursment,
    {
      onSuccess() {
        message.success("Deleted Sanction Disbursment")
      },
      onError() {
        message.error("Failed to Delete Sanction Disbursment")
      },
    }
  )
  const [Edit, setEdit] = React.useState<any>({
    status: "NOT_UPLOAD",
  })

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      refetch()
      setEdit({
        status: "NOT_UPLOAD",
      })
    },
  })

  const [data, { refetch }] = useQuery(getSanctionDisbursments, {
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
      Header: "Client Name",
      accessor: "client_name",
    },
    {
      Header: "Product",
      accessor: "product",
      Cell: ({ value }) => <p>{client_service_options[value]}</p>,
    },
    {
      Header: "Amount Sanctioned",
      accessor: "amount_sanctioned",
      Cell: NumberCell,
    },
    {
      Header: "Date of Sanction",
      accessor: "date_of_sanction",
      Cell: DateCell,
    },
    {
      Header: "Bank Name",
      accessor: "bank_name",
    },
    {
      Header: "Rate of Interest",
      accessor: "rate_of_interest",
    },
    {
      Header: "Tenure",
      accessor: "tenure",
    },
    // {
    //   Header: "Status",
    //   accessor: "file",
    //   Cell: StatusPillCell,
    // },
    // {
    //   Header: "Download",
    //   accessor: "file",
    //   id: "id",
    //   Cell: DownloadCell,
    // },
    // {
    //   Header: "Upload on",
    //   accessor: "updatedAt",
    //   Cell: DateCell,
    // },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <ActionComponent
          session={session}
          isDeleting={isLoading}
          onDelete={async () => {
            await deleteSanctionDisbursmentMutation(row.original)
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
        title="Sanction Disbursment"
        rightRender={() => (
          <CreateButtonTable
            session={session}
            allowRoles={["ADMIN", "STAFF"]}
            title="Add New Sanction Disbursment"
            onClick={onOpen}
          />
        )}
        data={data.sanctionDisbursments}
        columns={columns}
      />

      <DrawerForm
        isOpen={isOpen}
        firstField={firstField}
        onClose={onClose}
        title="Add Project Report"
      >
        <SanctionDisbursmentForm
          submitText="Create Sanction Disbursment"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateSanctionDisbursment}
          initialValues={Edit}
          onSubmit={async (values) => {
            console.log(
              "🚀 ~ file: SanctionDisbursment.tsx ~ line 216 ~ onSubmit={ ~ values",
              values
            )
            try {
              if (values.id) {
                await updateSanctionDisbursmentMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                })
              } else {
                await createSanctionDisbursmentMutation({
                  ...values,
                  // client_name: enquiry.client_name,
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

export default SanctionDisbursment
