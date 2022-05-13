import { v4 as uuidv4 } from "uuid"
import { EnquireUserInterface, getUsersType } from "./type"

export const getExtension = (fname: string) => {
  return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2)
}

export const getFileName = (enquiryId: number, folder: string, fileName: string) => {
  return `${enquiryId}/${folder}/${uuidv4()}_${new Date().getTime()}.${getExtension(fileName)}`
}

export const TransformationData = (staff: getUsersType, StaffEnquiry: EnquireUserInterface[]) => {
  const selected = StaffEnquiry.map((arr) => arr.value) ?? []
  const users = staff?.users.filter((arr) => !selected.includes(arr.id)) ?? []

  const users1 = users.map((item) => {
    return {
      value: item.id,
      label: item.name,
    }
  })

  return users1 ?? []
}

export const convertStringToKey = (str: string) => {
  if (!str && str.length === 0 && typeof str !== "string") {
    return ""
  }
  if (!str) {
    return ""
  }

  if (typeof window !== "undefined") {
    return str.toLowerCase().replaceAll(" ", "_").replaceAll("-", "_")
  }
  return str.toLowerCase().replace(/ /g, "_").replace(/-/g, "_")
}

const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

export const constructObject = (arr: { name: string }[]) => {
  return arr.reduce((acc, val) => {
    acc[convertStringToKey(val.name)] = val.name
    return acc
  }, {})
}

export const exportToCSVWithColumn = function (
  tableData: any[],
  tableName: string,
  tableColumn: Object
) {
  const column = Object.keys(tableData[0])
    .map((arr) => tableColumn[arr] ?? arr)
    .join(",")
  let csvContent = "data:text/csv;charset=utf-8,"
  const table = [
    column,
    ...tableData.map((item) => {
      const data = objectMap(item, (v) => (typeof v === "string" ? v : v.toString()))
      return Object.values(data).join(",").replace(/,\s*$/u, "")
    }),
  ]
  csvContent += table.join("\n")
  const data = encodeURI(csvContent)
  const downloadLink = document.createElement("a")
  const fileName = tableName + ".csv"
  downloadLink.setAttribute("href", data)
  downloadLink.setAttribute("download", fileName)
  downloadLink.click()
}

export const exportToCSV = function (tableData, tableName) {
  let csvContent = "data:text/csv;charset=utf-8,"
  csvContent += [
    Object.keys(tableData[0]).join(","),
    ...tableData.map((item) => Object.values(item).join(",").replace(/,\s*$/u, "")),
  ].join("\n")
  const data = encodeURI(csvContent)
  const downloadLink = document.createElement("a")
  const fileName = tableName + ".csv"
  downloadLink.setAttribute("href", data)
  downloadLink.setAttribute("download", fileName)
  downloadLink.click()
}

export const client_service_options = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "MORTGAGE_LOAN", label: "Mortgage Loan" },
  { value: "UNSECURED_LOAN", label: "Unsecured Loan" },
  { value: "MSME_LOAN", label: "MSME Loan" },
  { value: "STARTUP_LOAN", label: "Startup Loan" },
  { value: "SUBSIDY_SCHEMES", label: "Subsidy Schemes" },
].reduce((obj, item) => Object.assign(obj, { [item.value]: item.label }), {})

export const client_occupations_type_options = [
  { value: "SALARIED_INDIVIDUAL", label: "Salaried Individual" },
  { value: "INDIVIDUAL", label: "Individual" },
  {
    value: "SELF_EMPLOYED_INDIVIDUAL_OR_PROPRIETORSHIP",
    label: "Self Employed Individual / Proprietorship",
  },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "COMPANY", label: "Company" },
].reduce((obj, item) => Object.assign(obj, { [item.value]: item.label }), {})

export const client_service_options_data = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "MORTGAGE_LOAN", label: "Mortgage Loan" },
  { value: "UNSECURED_LOAN", label: "Unsecured Loan" },
  { value: "MSME_LOAN", label: "MSME Loan" },
  { value: "STARTUP_LOAN", label: "Startup Loan" },
  { value: "SUBSIDY_SCHEMES", label: "Subsidy Schemes" },
]

export const fileNameSplit = (name: string) => {
  return [name.substring(0, name.lastIndexOf(".")), name.substring(name.lastIndexOf(".") + 1)]
}
