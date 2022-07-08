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
import { useDisclosure } from "@chakra-ui/react"
import { FORM_ERROR } from "final-form"
import getLogs from "app/logs/queries/getLogs"
import createProjectReport from "../mutations/createProjectReport"
import deleteProjectReport from "../mutations/deleteProjectReport"
import updateProjectReport from "../mutations/updateProjectReport"
import { ProjectReportForm } from "./ProjectReportForm"
import getProjectReports from "../queries/getProjectReports"
import { CreateProjectReport } from "app/auth/validations"
import DrawerForm from "app/core/components/DrawerForm"
import { ActionComponent } from "app/core/components/ActionComponent"
import Table, {
  CreateButtonTable,
  DateCell,
  DownloadCell,
  StatusPillCell,
} from "app/core/components/Table"
import { toast } from "app/pages/_app"
import { ColumnDef } from "@tanstack/react-table"

const ProjectReport = () => {
  const enquiryId = useParam("enquiryId", "number")
  const router = useRouter()

  const page = Number(router.query.page) || 0
  const search = (router.query.search as string) || ""
  const take = Number(router.query.take) || 10

  const [createProjectReportMutation] = useMutation(createProjectReport, {
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
  const [updateProjectReportMutation] = useMutation(updateProjectReport, {
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
  const [deleteProjectReportMutation, { isLoading }] = useMutation(deleteProjectReport, {
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

  const [data, { refetch }] = useQuery(getProjectReports, {
    orderBy: { id: "asc" },
    skip: take * page,
    take: take,
    where: {
      label: {
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
      header: "label",
      accessorKey: "label",
    },
    {
      header: "remark",
      accessorKey: "remark",
    },
    {
      header: "Status",
      accessorKey: "file",
      cell: StatusPillCell,
    },
    {
      header: "Download",
      accessorKey: "file",
      id: "id",
      cell: DownloadCell,
    },
    {
      header: "Upload on",
      accessorKey: "updatedAt",
      cell: DateCell,
    },
    {
      header: "Action",
      cell: ({ row }) => (
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
        count={data.count}
        hasMore={data.hasMore}
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
          schema={CreateProjectReport}
          initialValues={Edit}
          onSubmit={async (values: any) => {
            console.log(values)
            try {
              if (values?.id) {
                await updateProjectReportMutation({
                  ...values,
                  remark: values?.remark ? values?.remark : "",
                } as any)
              } else {
                await createProjectReportMutation({
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

export default ProjectReport
