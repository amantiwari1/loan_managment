import { Enquiry } from "@prisma/client"
import { message, Table } from "antd"
import React from "react"
import { getQueryKey, queryClient, useMutation, useQuery } from "blitz"
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
import createCaseStatus from "../mutations/createCaseStatus"
import deleteCaseStatus from "../mutations/deleteCaseStatus"
import updateCaseStatus from "../mutations/updateCaseStatus"
import { CaseStatusForm } from "./CaseStatusForm"
import getCaseStatuses from "../queries/getCaseStatuses"
import getLogs from "../../logs/queries/getLogs"

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
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-2xl font-light">Case status</p>
      </div>
      <div className="flex space-x-1">
        <Button w={220} onClick={onClick} leftIcon={<AddIcon />}>
          Add New Case status
        </Button>
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
              Delete CaseStatus
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

const CaseStatus = ({ enquiry }: { enquiry: Enquiry }) => {
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
  const [Edit, setEdit] = React.useState({
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

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bank_name",
      key: "bank_name",
      render: (bank_name) => <p>{bank_name}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag colorScheme={StatusData[status]?.color}>{StatusData[status]?.title}</Tag>
      ),
    },
    {
      title: "Response From Bank",
      dataIndex: "response_from_bank",
      render: (response_from_bank) => (
        <Tag colorScheme={response_from_bank ? "green" : "red"}>
          {response_from_bank ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Final Login",
      dataIndex: "final_login",
      render: (final_login) => <p>{final_login}</p>,
    },
    {
      title: "remark",
      dataIndex: "remark",
      render: (remark) => <p>{remark}</p>,
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
            await deleteCaseStatusMutation(record)
            await onRefreshData()
          }}
          onEdit={() => {
            setEdit(record)
            onOpen()
          }}
        />
      ),
    },
  ]

  return (
    <div>
      <Table
        title={() => <AddNewButton onClick={onOpen} />}
        dataSource={data.caseStatuses}
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
            <CaseStatusForm
              submitText="Create CaseStatus"
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

export default CaseStatus
