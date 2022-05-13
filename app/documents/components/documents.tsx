import React, { useState } from "react"
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
import { toast } from "app/pages/_app"

const AddNewButton = ({ onClick }: { onClick: () => void }) => {
  const session = useSession()
  const enquiryId = useParam("enquiryId", "number")

  const [SendIntimationMutation, { isLoading: isLoadingSendIntimation }] = useMutation(
    sendIntimation,
    {
      onSuccess: () => {
        toast({
          title: "Sent Intimation.",
          status: "success",
          isClosable: true,
        })
      },
      onError: () => {
        toast({
          title: "Please select Co Applicant.",
          status: "success",
          isClosable: true,
        })
      },
    }
  )

  return (
    <div className="flex justify-between">
      {!["USER", "PARTNER"].includes(session.role as string) && (
        <div className=" flex items-center space-x-1  ">
          <Button w={180} onClick={onClick} leftIcon={<AddIcon />} size="sm">
            Add New Document
          </Button>
          <Button
            variant="outline"
            w={150}
            size="sm"
            isLoading={isLoadingSendIntimation}
            disabled={isLoadingSendIntimation}
            onClick={() => {
              SendIntimationMutation({ id: enquiryId })
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

  const [createDocumentMutation] = useMutation(createDocument, {
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
  const [updateDocumentMutation] = useMutation(updateDocument, {
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
  const [deleteDocumentMutation, { isLoading }] = useMutation(deleteDocument, {
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
    enquiryId: enquiryId,
    is_public_user: true,
  }

  if (["ADMIN", "STAFF"].includes(session.role)) {
    where = {
      enquiryId: enquiryId,
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
        enquiryId: enquiryId,
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
      Cell: ({ value, row }) => (
        <DownloadMultiCell
          value={value}
          id={row.original.id}
          name="Document"
          relationName="documentId"
        />
      ),
    },
    {
      Header: "Remark",
      accessor: "remark",
    },
    {
      Header: "Show User",
      accessor: "is_public_user",
      Cell: ({ value, row }) => {
        const [SwitchDocumentMutation, { isLoading: isLoadingSwitch }] = useMutation(SwitchDocument)

        return (
          <Switch
            defaultChecked={value}
            isDisabled={isLoadingSwitch}
            onChange={async (e) => {
              await SwitchDocumentMutation({
                id: row.original.id,
                enquiryId,
                is_public_user: e.target.checked,
              }).finally(async () => {
                await refetch()
              })
            }}
          />
        )
      },
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
        rightRender={() => <AddNewButton onClick={onOpen} />}
        title="Documents"
        data={data.documents}
        columns={columns}
      />

      <DrawerForm isOpen={isOpen} firstField={firstField} onClose={onClose} title="Document">
        <DocumentForm
          id="document-form"
          submitText="Create Document"
          schema={CreateDocument}
          initialValues={Edit}
          onSubmit={async (values) => {
            try {
              if (values.id) {
                await updateDocumentMutation(values as any)
              } else {
                await createDocumentMutation({
                  ...values,
                  client_name: "",
                  enquiryId: enquiryId,
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
