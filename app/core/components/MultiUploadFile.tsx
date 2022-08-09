import React, { useState } from "react"
import { useMutation, useParam } from "blitz"
import { fileNameSplit, getFileName } from "app/common"
import GetPreSignUrl from "app/documents/mutations/GetPreSignUrl"

import axios from "axios"
import { toast } from "app/pages/_app"
import { DownloadButton, fileProps, onRefreshTeaserData } from "./Table"
import createMultiFileWithEnquiryId from "app/file/mutations/createMultiFileWithEnquiryId"
import { PulseLoader } from "react-spinners"
import classNames from "classnames"
import { useField } from "react-final-form"

const MultiUploadFile = ({ name, relationName }: { name: string; relationName: string }) => {
  const [GetPreSignUrlMutation] = useMutation(GetPreSignUrl)
  const enquiryId = useParam("enquiryId", "number") as number
  const [createFileMutation] = useMutation(createMultiFileWithEnquiryId)
  const [isUploading, setIsUploading] = useState(false)
  const { input } = useField<fileProps[]>("file")
  const { input: id } = useField<number>("id")

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
              id: id.value,
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
      await onRefreshTeaserData(enquiryId)
    }

    setIsUploading(false)
  }

  return (
    <div className="space-y-2 p-5 rounded-md m-5 border-2">
      {isUploading && (
        <div className="flex justify-center">
          <PulseLoader size={10} color="green" />
        </div>
      )}
      <div className={classNames({ hidden: isUploading }, "flex justify-center")}>
        {input.value && input.value.length ? (
          <div className="flex flex-wrap gap-5 ">
            {input.value.map((arr, key) => (
              <div key={key}>
                <DownloadButton
                  refresh={async () => {
                    await onRefreshTeaserData(enquiryId)
                  }}
                  fileType={arr.fileType}
                  id={arr.id}
                  name={arr.name}
                  keys={arr.key}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p>No file</p>
          </>
        )}
      </div>
      <div className="flex justify-start">
        <div>
          <input
            multiple
            type="file"
            accept=".doc,.docx,.pdf,.txt,.xls,.csv,.xlsx"
            onChange={uploadFile}
            className=" mx-auto max-w-sm block text-white
          file:mr-4 file:py-1 file:px-4
          file:rounded-md file:border-0
          file:outline-blue-900
          file:text-sm 
          file:bg-blue-50 file:text-white
          hover:file:bg-blue-100
          "
          />
        </div>
      </div>
    </div>
  )
}

export default MultiUploadFile
