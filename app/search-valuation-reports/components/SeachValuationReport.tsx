import { Enquiry } from "@prisma/client"
import { message, Table } from "antd"
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
import {
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  Drawer,
  Tag,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createSearchValuationReport from "../mutations/createSearchValuationReport"
import deleteSearchValuationReport from "../mutations/deleteSearchValuationReport"
import updateSearchValuationReport from "../mutations/updateSearchValuationReport"
import { SearchValuationReportForm } from "./SearchValuationReportForm"
import getSearchValuationReports from "../queries/getSearchValuationReports"
import getEnquiry from "app/enquiries/queries/getEnquiry"

const StatusData = {
  UPLOADED: {
    color: "green",
    title: "Uploaded",
  },
  NOT_UPLOAD: {
    color: "red",
    title: "No Upload",
  },
}

const AddNewButton = ({ onClick }) => {
  const session = useSession()
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-2xl font-light">Search Valuation Report</p>
      </div>
      <div className="flex space-x-1">
        {!["USER", "PARTNER"].includes(session.role as string) && (
          <Button w={220} onClick={onClick} leftIcon={<AddIcon />}>
            Add New Search Valuation Report
          </Button>
        )}
      </div>
    </div>
  )
}

const ActionComponent = ({ onEdit, onDelete, isDeleting }) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const onAlertClose = () => setIsAlertOpen(false)
  const firstField = React.useRef(null)

  return (
    <div className="flex space-x-4">
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={firstField} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete SearchValuationReport
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={firstField} variant="outline" onClick={onAlertClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={isDeleting}
                onClick={async () => {
                  await onDelete()
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
      <Button onClick={onEdit} variant="outline" leftIcon={<EditIcon />}>
        Edit
      </Button>
      <Button
        onClick={() => {
          setIsAlertOpen(true)
        }}
        colorScheme="red"
        leftIcon={<DeleteIcon />}
      >
        Delete
      </Button>
    </div>
  )
}

const SearchValuationReport = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })
  const session = useAuthenticatedSession()

  const [createSearchValuationReportMutation] = useMutation(createSearchValuationReport, {
    onSuccess() {
      message.success("Created Case")
    },
    onError() {
      message.error("Failed to Create SearchValuationReport")
    },
  })
  const [updateSearchValuationReportMutation] = useMutation(updateSearchValuationReport, {
    onSuccess() {
      message.success("Updated SearchValuationReport")
    },
    onError() {
      message.error("Failed to Updated SearchValuationReport")
    },
  })
  const [deleteSearchValuationReportMutation, { isLoading }] = useMutation(
    deleteSearchValuationReport,
    {
      onSuccess() {
        message.success("Deleted SearchValuationReport")
      },
      onError() {
        message.error("Failed to Delete SearchValuationReport")
      },
    }
  )
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

  const [data, { refetch }] = useQuery(getSearchValuationReports, {
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

  const columns = [
    {
      title: "Document",
      dataIndex: "document",
      key: "document",
      render: (document) => <p>{document}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag colorScheme={StatusData[status]?.color}>{StatusData[status]?.title}</Tag>
      ),
    },
    {
      title: "Upload on",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => <p>{new Date(updatedAt).toDateString()}</p>,
    },
    {
      title: "Action",
      dataIndex: "updatedAt",
      width: 100,
      render: (updatedAt, record) => (
        <ActionComponent
          isDeleting={isLoading}
          onDelete={async () => {
            await deleteSearchValuationReportMutation(record)
            await onRefreshData()
          }}
          onEdit={() => {
            setEdit(record)
            onOpen()
          }}
        />
      ),
    },
  ].slice(0, !["USER", "PARTNER"].includes(session.role as string) ? undefined : -1)

  return (
    <div>
      <Table
        title={() => <AddNewButton onClick={onOpen} />}
        dataSource={data.searchValuationReports}
        columns={columns}
      />

      <Drawer
        isOpen={isOpen}
        size="lg"
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Add New Case status</DrawerHeader>

          <DrawerBody>
            <SearchValuationReportForm
              submitText="Create Search Valuation Report"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={CreateSearchValuationReport}
              initialValues={Edit}
              onSubmit={async (values) => {
                try {
                  if (values.id) {
                    await updateSearchValuationReportMutation({
                      ...values,
                      remark: values?.remark ? values?.remark : "",
                    })
                  } else {
                    await createSearchValuationReportMutation({
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
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SearchValuationReport
