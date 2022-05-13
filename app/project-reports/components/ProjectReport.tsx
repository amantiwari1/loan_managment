import { message } from "antd"
import React from "react"
import {
  getQueryKey,
  queryClient,
  useAuthenticatedSession,
  useMutation,
  useParam,
  useQuery,
} from "blitz"
import { useDisclosure } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createProjectReport from "../mutations/createProjectReport"
import deleteProjectReport from "../mutations/deleteProjectReport"
import updateProjectReport from "../mutations/updateProjectReport"
import { ProjectReportForm } from "./ProjectReportForm"
import getProjectReports from "../queries/getProjectReports"
import { CreateProjectReport } from "app/auth/validations"
import getEnquiry from "app/enquiries/queries/getEnquiry"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import Table, {
  CreateButtonTable,
  DateCell,
  DownloadCell,
  StatusPillCell,
} from "app/core/components/Table"

const ProjectReport = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(
    getEnquiry,
    { id: enquiryId },
    {
      refetchOnWindowFocus: false,
    }
  )
  const [createProjectReportMutation] = useMutation(createProjectReport, {
    onSuccess() {
      message.success("Created Case")
    },
    onError() {
      message.error("Failed to Create ProjectReport")
    },
  })
  const [updateProjectReportMutation] = useMutation(updateProjectReport, {
    onSuccess() {
      message.success("Updated ProjectReport")
    },
    onError() {
      message.error("Failed to Updated ProjectReport")
    },
  })
  const [deleteProjectReportMutation, { isLoading }] = useMutation(deleteProjectReport, {
    onSuccess() {
      message.success("Deleted ProjectReport")
    },
    onError() {
      message.error("Failed to Delete ProjectReport")
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

  const [data, { refetch }] = useQuery(getProjectReports, {
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
      Header: "label",
      accessor: "label",
    },
    {
      Header: "remark",
      accessor: "remark",
    },
    {
      Header: "Status",
      accessor: "file",
      Cell: StatusPillCell,
    },
    {
      Header: "Download",
      accessor: "file",
      id: "id",
      Cell: DownloadCell,
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
            await deleteProjectReportMutation(row.original)
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
            title="Add New"
            onClick={onOpen}
          />
        )}
        title="Project Report"
        data={data.projectReports}
        columns={columns}
      />

      <DrawerForm isOpen={isOpen} firstField={firstField} onClose={onClose} title="Project Report">
        <ProjectReportForm
          submitText="Create Project Report"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          schema={CreateProjectReport}
          initialValues={Edit}
          onSubmit={async (values: any) => {
            try {
              if (values?.id) {
                await updateProjectReportMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                } as any)
              } else {
                await createProjectReportMutation({
                  ...values,
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

export default ProjectReport
