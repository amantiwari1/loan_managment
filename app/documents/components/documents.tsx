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
import getDocuments from "../queries/getDocuments"
import { Button } from "app/core/components/Button"
import { AddIcon } from "@chakra-ui/icons"
import { useDisclosure, Switch } from "@chakra-ui/react"
import { DocumentForm } from "./DocumentForm"
import createDocument from "../mutations/createDocument"
import { FORM_ERROR } from "final-form"
import getLogs from "../../logs/queries/getLogs"
import updateDocument from "../mutations/updateDocument"
import deleteDocument from "../mutations/deleteDocument"
import { CreateDocument } from "app/auth/validations"
import Table, {
  DateCell,
  DownloadMultiCell,
  StatusPillCell,
  TextCell,
} from "app/core/components/Table"
import SwitchDocument from "../mutations/SwitchDocument"
import { ActionComponent } from "app/core/components/ActionComponent"
import DrawerForm from "app/core/components/DrawerForm"
import sendIntimation from "../mutations/sendIntimation"
import { ColumnDef } from "@tanstack/react-table"
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
  const enquiryId = Number(useParam("enquiryId", "number"))
  const router = useRouter()

  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10

  const SwitchDocumentComponent = ({ getValue, row }) => {
    const [SwitchDocumentMutation, { isLoading: isLoadingSwitch }] = useMutation(SwitchDocument)

    return (
      <Switch
        size="sm"
        defaultChecked={getValue()}
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
  }

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
  const [Edit, setEdit] = React.useState()

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {},
  })
  const session = useAuthenticatedSession()

  let where: any = {
    enquiryId: enquiryId,
    is_public_user: true,
    document_name: {
      contains: search.toLowerCase(),
      mode: "insensitive",
    },
  }

  if (["ADMIN", "STAFF"].includes(session.role)) {
    where = {
      enquiryId: enquiryId,
      document_name: {
        contains: search.toLowerCase(),
        mode: "insensitive",
      },
    }
  }

  const [data, { refetch }] = useQuery(
    getDocuments,
    {
      orderBy: { id: "asc" },
      skip: take * page,
      take: take,
      where,
    },
    {
      refetchOnWindowFocus: false,
    }
  )

  const onRefreshData = async () => {
    const queryKey = getQueryKey(getLogs, {
      orderBy: { id: "asc" },
      skip: take * page,
      take: take,
      where,
    })
    await queryClient.invalidateQueries(queryKey)
    await refetch()
  }

  const columns: any = [
    {
      header: "Document",
      accessorKey: "document_name",
      cell: TextCell,
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: TextCell,
    },
    {
      header: "Status",
      accessorKey: "file",
      cell: StatusPillCell,
    },
    {
      header: "Upload on",
      accessorKey: "updatedAt",
      cell: DateCell,
    },
    {
      header: "Download",
      accessorKey: "file",
      id: "id",
      cell: ({ getValue, row }) => (
        <DownloadMultiCell
          value={getValue()}
          id={row.original.id}
          name="Document"
          relationName="documentId"
        />
      ),
    },
    {
      header: "Remark",
      accessorKey: "remark",
      cell: TextCell,
    },
    {
      header: "Show User",
      accessorKey: "is_public_user",
      cell: SwitchDocumentComponent,
    },
    {
      header: "Action",
      cell: ({ row }) => (
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
        count={data.count}
        hasMore={data.hasMore}
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
