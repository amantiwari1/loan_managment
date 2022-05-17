import React, { useState } from "react"
import { useTable, useSortBy } from "react-table"
import Select from "react-select"

import { SortIcon, SortUpIcon, SortDownIcon } from "./Icon"
import { Box, ButtonGroup, Center, Heading, IconButton, Input, Tag, Text } from "@chakra-ui/react"
import { AddIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons"
import { Button } from "./Button"
import { list_of_bank } from "../data/bank"
import { getQueryKey, Link, queryClient, Routes, useMutation, useParam, useRouter } from "blitz"
import {
  client_service_options,
  client_service_options_data,
  fileNameSplit,
  getFileName,
} from "app/common"
import DownloadPreSignUrl from "app/documents/mutations/DownloadPreSignUrl"
import createMultiFile from "app/file/mutations/createMultiFile"
import axios from "axios"

import GetPreSignUrl from "app/documents/mutations/GetPreSignUrl"
import className from "classnames"
import getDocuments from "app/documents/queries/getDocuments"
import { PulseLoader } from "react-spinners"
import deleteFile from "app/file/mutations/deleteFile"
import DeleteKeyFromSpace from "app/documents/mutations/DeleteKeyFromSpace"
import createMultiFileWithEnquiryId from "app/file/mutations/createMultiFileWithEnquiryId"
import { toast } from "app/pages/_app"

export const TextCell = ({ value }) => <Text fontSize="sm">{value}</Text>

// Define a default UI for filtering
function GlobalFilter({ count }) {
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

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...(options.values() as any)]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

const StatusData = {
  true: {
    color: "green",
    title: "Uploaded",
  },
  false: {
    color: "red",
    title: "No Upload",
  },
}

export const ClientNameCell = ({ value, row }) => {
  const ServiceValue = client_service_options[row.original.client_service]
  return (
    <div>
      <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
        <a className="text-lg font-bold">{value}</a>
      </Link>
      <p>{ServiceValue}</p>
    </div>
  )
}

export const StatusCaseDashboardCell = ({ value }) => (
  <Text fontSize="sm">{value ?? "Pending case status"}</Text>
)
export const BankNameCell = ({ value }) => <Text fontSize="sm">{value ?? "No Selected Bank"}</Text>
export const DateCell = ({ value }) => <Text fontSize="sm">{new Date(value).toDateString()}</Text>
export const NumberCell = ({ value }) => (
  <Text fontSize="sm"> ₹{parseInt(value.toString()).toLocaleString("hi")}</Text>
)
export const DownloadCell = ({ value }) => {
  const [DownloadPreSignUrlMutation, { isLoading: isLoadingUrl }] = useMutation(DownloadPreSignUrl)

  return (
    <>
      {value?.name ? (
        <Button
          variant="outline"
          w={40}
          onClick={async () => {
            const url = await DownloadPreSignUrlMutation({ key: value.key })
            download(url, value.name)
          }}
          isLoading={isLoadingUrl}
          leftIcon={<DownloadIcon />}
        >
          {value.name.substring(0, 6)}...{value.name.split(".").at(-1)}
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
const DownloadButton = ({ name, keys, id, fileType }) => {
  const enquiryId = useParam("enquiryId", "number")

  const [DownloadPreSignUrlMutation, { isLoading: isLoadingDownload }] =
    useMutation(DownloadPreSignUrl)
  const [DeleteFileMutation, { isLoading: isLoadingDelete }] = useMutation(deleteFile)
  const [DeleteKeyFromSpaceMutation, { isLoading: isLoadingDeleteUrl }] =
    useMutation(DeleteKeyFromSpace)

  const removeFile = async (id: number, key: string) => {
    await DeleteKeyFromSpaceMutation({ key: key })
    await DeleteFileMutation({ id: id })
    await onRefreshDocumentData(enquiryId)
  }
  return (
    <ButtonGroup size="xs" isAttached variant="outline">
      <Button
        size="xs"
        onClick={async () => {
          const url = await DownloadPreSignUrlMutation({ key: keys })
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
        onClick={() => removeFile(id, keys)}
        isLoading={isLoadingDownload || isLoadingDelete || isLoadingDelete}
        icon={<DeleteIcon />}
      />
    </ButtonGroup>
  )
}

export const onRefreshDocumentData = async (enquiryId) => {
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

export const DownloadMultiCell = ({
  value,
  name,
  id,
  relationName,
}: {
  value: any
  name: string
  id: number
  relationName: string
}) => {
  const [GetPreSignUrlMutation] = useMutation(GetPreSignUrl)
  const enquiryId = useParam("enquiryId", "number")
  const [createFileMutation] = useMutation(createMultiFileWithEnquiryId)
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    let isFailedUpload = false
    setIsUploading(true)
    const files = []
    for (let i = 0; i < e.target.files.length; i++) {
      const key = getFileName(enquiryId, name, e.target.files[i].name)
      const filename = fileNameSplit(e.target.files[i].name)

      files.push({
        key: key,
        name: filename[0],
        relation_name: relationName,
        fileType: filename[1],
        id: id,
      })
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

export const CreateButtonTable = ({ onClick, session, allowRoles, title }) => {
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
export function StatusPillCell({ value }) {
  return (
    <Text fontSize="sm">{value?.id ? new Date(value.updatedAt).toString() : "No Upload file"}</Text>
  )
}

function Table({ columns, data, title, rightRender, count, hasMore }) {
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

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

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
                {rightRender()}
              </div>

              {/* SEARCH */}
              <div className="flex gap-x-2">
                <GlobalFilter count={count} />
                {headerGroups.map((headerGroup) =>
                  headerGroup.headers.map((column) =>
                    column.Filter ? (
                      <div className="mt-2 sm:mt-0" key={column.id}>
                        {column.render("Filter")}
                      </div>
                    ) : null
                  )
                )}
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto ">
                <table
                  {...getTableProps()}
                  className="divide-y  w-full overflow-x-auto border-collapse  divide-gray-200"
                >
                  <thead className="bg-blue-50 text-white">
                    {headerGroups.map((headerGroup, key) => (
                      <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                        {headerGroup.headers.map((column, key) => (
                          <th
                            scope="col"
                            key={key}
                            className="group border px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                          >
                            <div className="flex items-center space-x-1">
                              <p>{column.render("Header")}</p>
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <SortDownIcon className="w-2 h-4 text-gray-400" />
                                  ) : (
                                    <SortUpIcon className="w-2 h-4 text-gray-400" />
                                  )
                                ) : (
                                  <SortIcon className="w-2 h-4 text-gray-400 " />
                                )}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                    {rows.map((row, i) => {
                      // new
                      prepareRow(row)
                      return (
                        <tr
                          className={
                            i % 2 === 0 ? "hover:bg-green-200" : "bg-green-50 hover:bg-green-200 "
                          }
                          key={i}
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell, key) => {
                            return (
                              <td
                                key={key}
                                {...cell.getCellProps()}
                                className="px-6 py-1 border whitespace-nowrap"
                                role="cell"
                              >
                                {cell.column.Cell.name === "defaultRenderer" ? (
                                  <div className="text-sm text-gray-500">{cell.render("Cell")}</div>
                                ) : (
                                  cell.render("Cell")
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {rows && rows.length === 0 && (
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
                    take: Number(e.value),
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
