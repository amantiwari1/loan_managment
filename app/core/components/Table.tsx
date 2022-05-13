import React, { useState } from "react"
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table"
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid"
import { SortIcon, SortUpIcon, SortDownIcon } from "./Icon"
import { ButtonGroup, IconButton, Input, Tag, Text } from "@chakra-ui/react"
import { AddIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons"
import { Button } from "./Button"
import { list_of_bank } from "../data/bank"
import { getQueryKey, Link, queryClient, Routes, useMutation, useParam } from "blitz"
import { client_service_options_data, fileNameSplit, getFileName } from "app/common"
import DownloadPreSignUrl from "app/documents/mutations/DownloadPreSignUrl"
import createMultiFile from "app/file/mutations/createMultiFile"
import axios from "axios"
import { message } from "antd"
import GetPreSignUrl from "app/documents/mutations/GetPreSignUrl"
import className from "classnames"
import getDocuments from "app/documents/queries/getDocuments"
import { PulseLoader } from "react-spinners"
import deleteFile from "app/file/mutations/deleteFile"
import DeleteKeyFromSpace from "app/documents/mutations/DeleteKeyFromSpace"
import createMultiFileWithEnquiryId from "app/file/mutations/createMultiFileWithEnquiryId"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function PageButton({ children, ...rest }) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

// Define a default UI for filtering
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <label className="w-full m-2">
      <Input
        type="text"
        w="full"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`Search ${count} records...`}
      />
    </label>
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

export const ClientNameCell = ({ value, row }) => (
  <div>
    <Link href={Routes.ShowEnquiryPage({ enquiryId: row.original.id })}>
      <a className="text-lg font-bold">{value}</a>
    </Link>
    <p>{client_service_options_data[row.original.client_service]}</p>
  </div>
)

export const StatusCaseDashboardCell = ({ value }) => (
  <p>{value ? "Case status completed" : "Pending case status"}</p>
)
export const BankNameCell = ({ value }) => <p>{value ? list_of_bank[value] : "No Selected Bank"}</p>
export const DateCell = ({ value }) => <p>{new Date(value).toDateString()}</p>
export const NumberCell = ({ value }) => <p> ₹{parseInt(value.toString()).toLocaleString("hi")}</p>
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
        colorScheme="blue"
        aria-label="Delete File"
        size="xs"
        onClick={() => removeFile(id, keys)}
        isLoading={isLoadingDownload || isLoadingDelete || isLoadingDelete}
        icon={<DeleteIcon />}
      />
    </ButtonGroup>
  )
}

const onRefreshDocumentData = async (enquiryId) => {
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
          message.error("failed to upload file")
          console.log(err)
        })
      } else {
        message.error("failed to upload file")
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
      <div className={className({ hidden: isUploading })}>
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
            className="w-full  mx-auto max-w-sm block text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:outline-green-900
          file:text-sm 
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100
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
  return <p>{value?.id ? new Date(value.updatedAt).toString() : "No Upload file"}</p>
}

function Table({ columns, data, title, rightRender }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination // new
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
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
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
                  <thead className="bg-gray-50">
                    {headerGroups.map((headerGroup, key) => (
                      <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                        {headerGroup.headers.map((column, key) => (
                          // Add the sorting props to control sorting. For this example
                          // we can add them into the header props
                          <th
                            scope="col"
                            key={key}
                            className="group border px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                          >
                            <div className="flex items-center space-x-1">
                              <p>{column.render("Header")}</p>
                              {/* Add a sort direction indicator */}
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
                    {page.map((row, i) => {
                      // new
                      prepareRow(row)
                      return (
                        <tr
                          className={
                            i % 2 === 0 ? "hover:bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button w={100} size="sm" onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button w={100} size="sm" onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
