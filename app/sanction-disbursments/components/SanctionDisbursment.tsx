import Table, { DateCell, NumberCell, TextCell } from "app/core/components/Table"

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
import { Button } from "app/core/components/Button"
import { AddIcon } from "@chakra-ui/icons"
import {
  useDisclosure,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createSanctionDisbursment from "../mutations/createSanctionDisbursment"
import deleteSanctionDisbursment from "../mutations/deleteSanctionDisbursment"
import updateSanctionDisbursment from "../mutations/updateSanctionDisbursment"
import { SanctionDisbursmentForm } from "./SanctionDisbursmentForm"
import getSanctionDisbursments from "../queries/getSanctionDisbursments"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import { client_service_options } from "app/common"
import updateEnquiryRequest from "app/enquiries/mutations/updateEnquiryRequest"
import { toast } from "app/pages/_app"
import { ColumnDef } from "@tanstack/react-table"

export const CreateButtonTable = ({ onClick, session, allowRoles, title }) => {
  const [updateEnquiryMutation, { isLoading }] = useMutation(updateEnquiryRequest)
  const enquiryId = Number(useParam("enquiryId", "number"))
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const onAlertClose = () => setIsAlertOpen(false)
  const onAlertOpen = () => setIsAlertOpen(true)

  const firstField = React.useRef(null)
  return (
    <div className="flex gap-5">
      <div>
        {allowRoles.includes(session.role as string) && (
          <Button onClick={onClick} leftIcon={<AddIcon />}>
            {title}
          </Button>
        )}
      </div>
      <Button
        onClick={onAlertOpen}
        variant="outline"
        isLoading={isLoading}
        colorScheme="Customblue"
      >
        Close Enquiry
      </Button>
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={firstField} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Enquiry
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to close this enquiry? You can&apos;t undo this action
              afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button size="sm" ref={firstField} variant="outline" onClick={onAlertClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                isLoading={isLoading}
                onClick={async () => {
                  await updateEnquiryMutation({
                    isNew: false,
                    id: enquiryId,
                    enquiry_request: "SANCTIONED",
                  })
                  onAlertClose()
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}

const SanctionDisbursment = () => {
  const enquiryId = useParam("enquiryId", "number")
  const router = useRouter()

  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10
  const [createSanctionDisbursmentMutation] = useMutation(createSanctionDisbursment, {
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
  const [updateSanctionDisbursmentMutation] = useMutation(updateSanctionDisbursment, {
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
  const [deleteSanctionDisbursmentMutation, { isLoading }] = useMutation(
    deleteSanctionDisbursment,
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
    onClose: () => {},
  })

  const [data, { refetch }] = useQuery(getSanctionDisbursments, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      client_name: {
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
      header: "Client Name",
      accessorKey: "client_name",
      cell: TextCell,
    },
    {
      header: "Product",
      accessorKey: "product",
      cell: ({ getValue }) => <Text fontSize="sm">{client_service_options[getValue()]}</Text>,
    },
    {
      header: "Amount Sanctioned",
      accessorKey: "amount_sanctioned",
      cell: NumberCell,
    },
    {
      header: "Date of Sanction",
      accessorKey: "date_of_sanction",
      cell: DateCell,
    },
    {
      header: "Bank Name",
      accessorKey: "bank_name",
      cell: TextCell,
    },
    {
      header: "Rate of Interest",
      accessorKey: "rate_of_interest",
      cell: TextCell,
    },
    {
      header: "Tenure",
      accessorKey: "tenure",
      cell: TextCell,
    },
    {
      header: "Action",
      cell: ({ row }) => (
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
        count={data.count}
        hasMore={data.hasMore}
        title="Sanctioned Disbursement"
        rightRender={() => (
          <CreateButtonTable
            session={session}
            allowRoles={["ADMIN", "STAFF"]}
            title="Add New"
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
        title="Sanctioned Disbursement"
      >
        <SanctionDisbursmentForm
          submitText="Create Sanction Disbursment"
          // schema={CreateSanctionDisbursment}
          initialValues={Edit}
          onSubmit={async (values) => {
            try {
              if (values.id) {
                await updateSanctionDisbursmentMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                })
              } else {
                await createSanctionDisbursmentMutation({
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

export default SanctionDisbursment
