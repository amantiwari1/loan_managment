import { v4 as uuidv4 } from "uuid"
import { EnquireUserInterface, getUsersType } from "./type"

export const getExtension = (fname: string) => {
  return fname.slice(((fname.lastIndexOf(".") - 1) >>> 0) + 2)
}

export const getFileName = (enquiryId: number, fileName: string) => {
  return `${enquiryId}/${uuidv4()}_${new Date().getTime()}.${getExtension(fileName)}`
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
