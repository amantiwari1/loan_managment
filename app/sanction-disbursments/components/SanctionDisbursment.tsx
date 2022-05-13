import Table, {
  DateCell,
  DownloadCell,
  NumberCell,
  StatusPillCell,
} from "app/core/components/Table"

import React from "react"
import {
  getQueryKey,
  queryClient,
  Routes,
  useAuthenticatedSession,
  useMutation,
  useParam,
  useQuery,
  useRouter,
  useSession,
} from "blitz"
import { Button } from "app/core/components/Button"
import { AddIcon } from "@chakra-ui/icons"
import {
  useDisclosure,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
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
import getEnquiry from "app/enquiries/queries/getEnquiry"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import { client_service_options } from "app/common"
import updateEnquiryRequest from "app/enquiries/mutations/updateEnquiryRequest"
import { toast } from "app/pages/_app"

export const CreateButtonTable = ({ onClick, session, allowRoles, title }) => {
  const router = useRouter()

  const [updateEnquiryMutation, { isLoading }] = useMutation(updateEnquiryRequest)
  const enquiryId = useParam("enquiryId", "number")
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
              Delete Document
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
  const [enquiry] = useQuery(
    getEnquiry,
    { id: enquiryId },
    {
      refetchOnWindowFocus: false,
    }
  )
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
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
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
