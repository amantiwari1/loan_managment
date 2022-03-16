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
import getDocuments from "../queries/getDocuments"
import { Button } from "app/core/components/Button"
import { AddIcon, DownloadIcon } from "@chakra-ui/icons"
import { useDisclosure, Tag, Switch } from "@chakra-ui/react"
import { DocumentForm } from "./DocumentForm"
import createDocument from "../mutations/createDocument"
import { FORM_ERROR } from "final-form"
import getLogs from "../../logs/queries/getLogs"
import updateDocument from "../mutations/updateDocument"
import deleteDocument from "../mutations/deleteDocument"
import { CreateDocument } from "app/auth/validations"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import Table, { DateCell, DownloadMultiCell, StatusPillCell } from "app/core/components/Table"
import SwitchDocument from "../mutations/SwitchDocument"
import { ActionComponent } from "app/core/components/ActionComponent"
import DrawerForm from "app/core/components/DrawerForm"
import sendIntimation from "../mutations/sendIntimation"
import { client_service_options } from "app/common"

const AddNewButton = ({ onClick, enquiry }: { onClick: () => void; enquiry: any }) => {
  const session = useSession()
  const [SendIntimationMutation, { isLoading: isLoadingSendIntimation }] = useMutation(
    sendIntimation,
    {
      onSuccess: () => {
        message.success("sent Intimation")
      },
    }
  )

  return (
    <div className="flex justify-between">
      {!["USER", "PARTNER"].includes(session.role as string) && (
        <div className=" flex items-center space-x-1  ">
          <Button w={220} onClick={onClick} leftIcon={<AddIcon />} size="sm">
            Add New Document
          </Button>
          <Button
            variant="outline"
            w={150}
            size="sm"
            isLoading={isLoadingSendIntimation}
            disabled={isLoadingSendIntimation}
            onClick={() => {
              if (enquiry.customer.user.email || enquiry.partner[0].user.email) {
                SendIntimationMutation({
                  name: enquiry.customer.user.name ?? enquiry.partner[0].user.name ?? "",
                  email: enquiry.customer.user.email ?? enquiry.partner[0].user.email ?? "",
                  product: client_service_options[enquiry.client_service],
                })
              } else {
                message.error("Please select Co Applicant")
              }
            }}
          >
            Send Intimation
          </Button>
        </div>
      )}
    </div>
  )
}

const Document = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(
    getEnquiry,
    { id: enquiryId },
    {
      refetchOnWindowFocus: false,
    }
  )

  const [SwitchDocumentMutation, { isLoading: isLoadingSwitch }] = useMutation(SwitchDocument)

  const [createDocumentMutation] = useMutation(createDocument, {
    onSuccess() {
      message.success("Created Document")
    },
    onError() {
      message.error("Failed to Create Document")
    },
  })
  const [updateDocumentMutation] = useMutation(updateDocument, {
    onSuccess() {
      message.success("Updated Document")
    },
    onError() {
      message.error("Failed to Updated Document")
    },
  })
  const [deleteDocumentMutation, { isLoading }] = useMutation(deleteDocument, {
    onSuccess() {
      message.success("Deleted Document")
    },
    onError() {
      message.error("Failed to Delete Document")
    },
  })
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
  const session = useAuthenticatedSession()

  let where: any = {
    enquiryId: enquiry.id,
    is_public_user: true,
  }

  if (["ADMIN", "STAFF"].includes(session.role)) {
    where = {
      enquiryId: enquiry.id,
    }
  }

  const [data, { refetch }] = useQuery(
    getDocuments,
    {
      where,
    },
    {
      refetchOnWindowFocus: false,
    }
  )

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
      Header: "Document",
      accessor: "document_name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Status",
      accessor: "file",
      Cell: StatusPillCell,
    },
    {
      Header: "Upload on",
      accessor: "updatedAt",
      Cell: DateCell,
    },
    {
      Header: "Download",
      accessor: "file",
      id: "id",
      Cell: DownloadMultiCell,
    },
    {
      Header: "Remark",
      accessor: "remark",
    },
    {
      Header: "Show User",
      accessor: "is_public_user",
      Cell: ({ value, row }) => (
        <Switch
          defaultChecked={value}
          isDisabled={isLoadingSwitch}
          onChange={async (e) => {
            await SwitchDocumentMutation({
              id: row.original.id,
              enquiryId,
              is_public_user: e.target.checked,
            })
            await refetch()
          }}
        />
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <ActionComponent
          isDeleting={isLoading}
          session={session}
          onDelete={async () => {
            await deleteDocumentMutation(row.original)
            await onRefreshData()
          }}
          onEdit={() => {
            setEdit(row.original)
            onOpen()
          }}
        />
      ),
    },
  ].slice(0, !["PARTNER"].includes(session.role as string) ? undefined : -1)

  return (
    <div>
      <Table
        rightRender={() => <AddNewButton onClick={onOpen} enquiry={enquiry} />}
        title="Documents"
        data={data.documents}
        columns={columns}
      />

      <DrawerForm
        isOpen={isOpen}
        firstField={firstField}
        onClose={onClose}
        title="Add New Document"
      >
        <DocumentForm
          id="document-form"
          submitText="Create Document"
          schema={CreateDocument}
          initialValues={Edit}
          onSubmit={async (values) => {
            console.log(values)
            try {
              if (values.id) {
                await updateDocumentMutation(values as any)
              } else {
                await createDocumentMutation({
                  ...values,
                  client_name: enquiry.client_name,
                  enquiryId: enquiry.id,
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

export default Document
