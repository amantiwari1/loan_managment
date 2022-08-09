import React, { useState } from "react"
import {
  Cell,
  Column,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

interface CellProps {
  table: any
  column: Column<any, any>
  row: Row<any>
  cell: Cell<any, any>
  getValue: () => any
  renderValue: () => any
}

import Select from "react-select"

import { SortIcon, SortUpIcon, SortDownIcon } from "./Icon"
import { Box, ButtonGroup, Center, Heading, IconButton, Input, Text } from "@chakra-ui/react"
import { AddIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons"
import { Button } from "./Button"
import { getQueryKey, Link, queryClient, Routes, useMutation, useParam, useRouter } from "blitz"
import { client_service_options, fileNameSplit, getFileName } from "app/common"
import DownloadPreSignUrl from "app/documents/mutations/DownloadPreSignUrl"
import axios from "axios"

import GetPreSignUrl from "app/documents/mutations/GetPreSignUrl"
import className from "classnames"
import getDocuments from "app/documents/queries/getDocuments"
import { PulseLoader } from "react-spinners"
import deleteFile from "app/file/mutations/deleteFile"
import DeleteKeyFromSpace from "app/documents/mutations/DeleteKeyFromSpace"
import createMultiFileWithEnquiryId from "app/file/mutations/createMultiFileWithEnquiryId"
import { toast } from "app/pages/_app"
import getRelationshipEnquiry from "app/enquiries/queries/getRelationshipEnquiry"

export const TextCell = ({ getValue }: CellProps) => <Text fontSize="sm">{getValue()}</Text>

// Define a default UI for filtering
function GlobalFilter({ count }: { count: number }) {
  const router = useRouter()
  const { pathname, query } = router

  const [value, setValue] = React.useState(query.search)

  const onSearch = () =>
    router.push({
      pathname,
      query: {
        ...query,
        search: value,
        page: 0,
      },
    })

  return (
    <div className="flex items-center gap-2 w-full m-2">
      <label className="w-full ">
        <Input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSearch()
            }
          }}
          size="sm"
          type="text"
          w="full"
          rounded="md"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          placeholder={`Search ${count} records...`}
        />
      </label>
      <Button w={150} onClick={onSearch}>
        Search
      </Button>
    </div>
  )
}

export const ClientNameCell = ({ getValue, row }: CellProps) => {
  const ServiceValue = client_service_options[row.original.client_service]
  return (
    <div>
      <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
        <a className="text-lg font-bold">{getValue()}</a>
      </Link>
      <p>{ServiceValue}</p>
    </div>
  )
}

export const StatusCaseDashboardCell = ({ getValue }: CellProps) => (
  <Text fontSize="sm">{getValue() ?? "Pending case status"}</Text>
)
export const BankNameCell = ({ getValue }: CellProps) => (
  <Text fontSize="sm">{getValue() ?? "No Selected Bank"}</Text>
)
export const DateCell = ({ getValue }: CellProps) => (
  <Text fontSize="sm">{new Date(getValue()).toDateString()}</Text>
)
export const NumberCell = ({ getValue }: CellProps) => (
  <Text fontSize="sm"> ₹{parseInt(getValue().toString()).toLocaleString("hi")}</Text>
)
export const DownloadCell = ({ getValue }: CellProps) => {
  const [DownloadPreSignUrlMutation, { isLoading: isLoadingUrl }] = useMutation(DownloadPreSignUrl)

  return (
    <>
      {getValue()?.name ? (
        <Button
          variant="outline"
          w={40}
          onClick={async () => {
            const url = (await DownloadPreSignUrlMutation({ key: getValue()?.key })) as string
            download(url, getValue().name)
          }}
          isLoading={isLoadingUrl}
          leftIcon={<DownloadIcon />}
        >
          {getValue().name.substring(0, 6)}...{getValue().name.split(".").at(-1)}
        </Button>
      ) : (
        <p>No Upload file</p>
      )}
    </>
  )
}

function download(url: string, filename: string) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    })
    .catch(console.error)
}
export const DownloadButton = ({
  name,
  keys,
  id,
  fileType,
  refresh,
}: {
  name: string
  keys: string
  id: number
  fileType: string
  refresh: () => void
}) => {
  const enquiryId = useParam("enquiryId", "number")

  const [DownloadPreSignUrlMutation, { isLoading: isLoadingDownload }] =
    useMutation(DownloadPreSignUrl)
  const [DeleteFileMutation, { isLoading: isLoadingDelete }] = useMutation(deleteFile)
  const [DeleteKeyFromSpaceMutation] = useMutation(DeleteKeyFromSpace)

  const removeFile = async (id: number, key: string) => {
    await DeleteKeyFromSpaceMutation({ key: key })
    await DeleteFileMutation({ id: id })
    await refresh()
  }
  return (
    <ButtonGroup size="xs" isAttached variant="outline">
      <Button
        size="xs"
        onClick={async () => {
          const url = (await DownloadPreSignUrlMutation({ key: keys })) as string
          download(url, name + "." + fileType)
        }}
        isLoading={isLoadingDownload || isLoadingDelete || isLoadingDelete}
        leftIcon={<DownloadIcon />}
      >
        {name.substring(0, 6)}...{fileType}
      </Button>
      <IconButton
        colorScheme="Customblue"
        aria-label="Delete File"
        size="xs"
        onClick={async () => await removeFile(id, keys)}
        isLoading={isLoadingDownload || isLoadingDelete || isLoadingDelete}
        icon={<DeleteIcon />}
      />
    </ButtonGroup>
  )
}

export const onRefreshDocumentData = async (enquiryId: number | undefined) => {
  const queryKey = getQueryKey(getDocuments, {
    where: {
      enquiryId: enquiryId,
    },
  })
  const queryKeySecond = getQueryKey(getDocuments, {
    where: {
      enquiryId: enquiryId,
      is_public_user: true,
    },
  })

  await queryClient.invalidateQueries(queryKey)
  await queryClient.invalidateQueries(queryKeySecond)
}

export const onRefreshTeaserData = async (enquiryId: number | undefined) => {
  const queryKey = getQueryKey(getRelationshipEnquiry, {
    id: enquiryId,
    select: {
      id: true,
      Teaser: {
        select: {
          id: true,
          data: true,
          file: true,
        },
      },
      client_service: true,
    },
  })

  await queryClient.invalidateQueries(queryKey)
}

export interface fileProps {
  name: string
  id: number
  fileType: string
  key: string
  relation_name: string
}
export const DownloadMultiCell = ({
  value,
  name,
  id,
  relationName,
}: {
  value: fileProps[]
  name: string
  id: number
  relationName: string
}) => {
  const [GetPreSignUrlMutation] = useMutation(GetPreSignUrl)
  const enquiryId = useParam("enquiryId", "number") as number
  const [createFileMutation] = useMutation(createMultiFileWithEnquiryId)
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    let isFailedUpload = false
    setIsUploading(true)
    const files: fileProps[] = []

    if (e.target && e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        let filenameTarget = e?.target?.files[i]?.name

        if (filenameTarget) {
          const key = getFileName(enquiryId, name, filenameTarget)
          const filename = fileNameSplit(filenameTarget)

          if (filename && filename[0] && filename[1]) {
            files.push({
              key: key,
              name: filename[0],
              relation_name: relationName,
              fileType: filename[1],
              id: id,
            })
          }
          const url = await GetPreSignUrlMutation({ key: key })
          const formData = new FormData()
          Object.entries({ file: e.target.files[i] }).forEach(([key, value]: any) => {
            formData.append(key, value)
          })
          if (url) {
            await axios.put(url, formData).catch((err) => {
              isFailedUpload = true
              toast({
                title: "Failed to Upload file.",
                status: "error",
                isClosable: true,
              })
              console.log(err)
            })
          } else {
            toast({
              title: "Failed to Upload file.",
              status: "error",
              isClosable: true,
            })
          }
        }
      }
    }

    if (!isFailedUpload) {
      await createFileMutation({ files: files })
      await onRefreshDocumentData(enquiryId)
    }

    setIsUploading(false)
  }

  return (
    <div className="space-y-2 w-32">
      {isUploading && (
        <div className="flex justify-center">
          <PulseLoader size={10} color="green" />
        </div>
      )}
      <div className={className({ hidden: isUploading }, "flex justify-center")}>
        {value && value.length ? (
          <div className="space-y-2">
            {value.map((arr, key) => (
              <div key={key}>
                <DownloadButton
                  fileType={arr.fileType}
                  refresh={async () => await onRefreshDocumentData(enquiryId)}
                  id={arr.id}
                  name={arr.name}
                  keys={arr.key}
                />
              </div>
            ))}
          </div>
        ) : (
          <input
            multiple
            type="file"
            accept=".doc,.docx,.pdf,.txt,.xls,.csv,.xlsx"
            onChange={uploadFile}
            className="w-full  mx-auto max-w-sm block text-white
          file:mr-4 file:py-1 file:px-4
          file:rounded-md file:border-0
          file:outline-blue-900
          file:text-sm 
          file:bg-blue-50 file:text-white
          hover:file:bg-blue-100
          "
          />
        )}
      </div>
    </div>
  )
}

interface CreateButtonTableProps {
  onClick: () => void
  allowRoles: string[]
  title: string
  session: {
    role: string
  }
}

export const CreateButtonTable = ({
  onClick,
  session,
  allowRoles,
  title,
}: CreateButtonTableProps) => {
  return (
    <div>
      {allowRoles.includes(session.role as string) && (
        <Button onClick={onClick} leftIcon={<AddIcon />}>
          {title}
        </Button>
      )}
    </div>
  )
}
export const StatusPillCell = ({ getValue }: CellProps) => {
  return (
    <Text fontSize="sm">
      {getValue()?.id ? new Date(getValue().updatedAt).toString() : "No Upload file"}
    </Text>
  )
}

interface TableProps {
  data: object[]
  columns: any[]
  title: string
  rightRender?: () => JSX.Element
  count: number
  hasMore: boolean
}

function Table({ columns, data, title, rightRender, count, hasMore }: TableProps) {
  const router = useRouter()
  const { pathname, query } = router

  const pageQuery = Number(query.page) || 0
  const take = Number(query.take) || 10

  const goTo = (number: number) =>
    router.push({
      pathname,
      query: {
        ...query,
        page: pageQuery + number,
      },
    })

  const [sorting, setSorting] = React.useState<SortingState>([])

  const tableReact = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  // Render the UI for your table
  return (
    <div>
      <div className="mt-2">
        <div className="">
          <div className="py-2">
            {/* Title */}
            <div className="shadow border-b bg-white border-gray-200 sm:rounded-lg">
              <div className="flex justify-between items-center p-2 px-3">
                <p className="text-xl font-bold">{title}</p>
                {rightRender ? rightRender() : null}
              </div>

              {/* SEARCH */}
              <div className="flex gap-x-2">
                <GlobalFilter count={count} />
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto ">
                <table className="divide-y  w-full overflow-x-auto border-collapse  divide-gray-200">
                  <thead className="bg-blue-50 text-white">
                    {tableReact.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="group border px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                          >
                            <div
                              className="flex items-center space-x-1"
                              {...{ onClick: header.column.getToggleSortingHandler() }}
                            >
                              <p>
                                {flexRender(header?.column?.columnDef?.header, header.getContext())}
                              </p>
                              <span>
                                {{
                                  asc: <SortUpIcon className="w-2 h-4 text-gray-400" />,
                                  desc: <SortDownIcon className="w-2 h-4 text-gray-400" />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <SortIcon className="w-2 h-4 text-gray-400 " />
                                )}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableReact.getRowModel().rows.map((row, i) => {
                      return (
                        <tr
                          className={
                            i % 2 === 0 ? "hover:bg-green-200" : "bg-green-50 hover:bg-green-200 "
                          }
                          key={row.id}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <td
                                key={cell.id}
                                className="px-6 py-1 border whitespace-nowrap"
                                role="cell"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {tableReact.getRowModel().rows && tableReact.getRowModel().rows.length === 0 && (
                  <Box w="full" p={5} rounded="md" shadow="md">
                    <Center>
                      <svg
                        className="h-32 w-32"
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M23.5,27.5H6.5l-1-15.19a.76.76,0,0,1,.77-.81H10a1.11,1.11,0,0,1,.89.44l1.22,1.56H23.5v2"
                        />
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M26.3,20.7l.84-3.2H9.25L6.5,27.5H23.41a1.42,1.42,0,0,0,1.37-1.06l.76-2.88"
                        />
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5,24.5h0a1.42,1.42,0,0,1,2,0h0"
                        />
                        <line
                          x1="13.5"
                          x2="14.5"
                          y1="21.5"
                          y2="21.5"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="20.5"
                          x2="21.5"
                          y1="21.5"
                          y2="21.5"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.62,3.61C18.25,4,16.5,5.37,16.5,7a2.57,2.57,0,0,0,.7,1.7l-.7,2.8,2.86-1.43A8.12,8.12,0,0,0,22,10.5c3,0,5.5-1.57,5.5-3.5,0-1.6-1.69-2.95-4-3.37"
                        />
                        <line
                          x1="21.25"
                          x2="22.75"
                          y1="6.25"
                          y2="7.75"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="22.75"
                          x2="21.25"
                          y1="6.25"
                          y2="7.75"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Center>
                    <Center>
                      <Heading as="h4" size="md">
                        No Data
                      </Heading>
                    </Center>
                  </Box>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm">Total: {count}</span>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{pageQuery + 1}</span> of{" "}
              <span className="font-medium">{Math.round(count / take)}</span>
            </span>

            <Select
              defaultValue={{
                value: take,
                label: `Show ${take}`,
              }}
              onChange={(e) => {
                router.push({
                  pathname,
                  query: {
                    ...query,
                    take: Number(e?.value),
                    page: 0,
                  },
                })
              }}
              options={[5, 10, 20, 50, 100].map((pageSize) => ({
                value: pageSize,
                label: `Show ${pageSize}`,
              }))}
            />
          </div>
          <div>
            <nav aria-label="Pagination" className="flex gap-5">
              <Button w={100} disabled={pageQuery === 0} onClick={() => goTo(-1)}>
                Previous
              </Button>
              <Button w={100} disabled={!hasMore} onClick={() => goTo(1)}>
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
