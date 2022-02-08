import React, { useEffect, useState } from "react"
import createFile from "app/file/mutations/createFile"
import { getAntiCSRFToken, useMutation, useParam, useQuery } from "blitz"
import { getFileName } from "app/common"
import { IconButton, Progress } from "@chakra-ui/react"
import { AiFillDelete } from "react-icons/ai"
import { useField } from "react-final-form"
import getFile from "app/file/queries/getFile"
import deleteFile from "app/file/mutations/deleteFile"

const UploadFile = () => {
  console.log("Rendered")
  const enquiryId = useParam("enquiryId", "number")
  const [createFileMutation, { isLoading }] = useMutation(createFile)
  const [DeleteFileMutation, { isLoading: isLoadingDelete }] = useMutation(deleteFile)
  const { input } = useField("fileId", {})
  const { input: fileNameInput } = useField("file.name", {})

  const ref = React.useRef<HTMLInputElement>()

  const removeFile = async () => {
    await DeleteFileMutation({ id: input.value })
    input.onChange(null)
    fileNameInput.onChange(null)
  }

  const uploadFile = async (e) => {
    const file = e.target.files[0]
    const key = encodeURIComponent(getFileName(enquiryId, file.name))

    const fileId = await createFileMutation({ key: key, name: file.name })
    input.onChange(fileId.id)
    fileNameInput.onChange(file.name)

    // const antiCSRFToken = getAntiCSRFToken()
    // const res = await fetch(`/api/upload-url?file=${key}`, {
    //   credentials: "include",
    //   headers: {
    //     "anti-csrf": antiCSRFToken,
    //   },
    // })
    // const { url, fields } = await res.json()
    // const formData = new FormData()

    // Object.entries({ ...fields, file }).forEach(([key, value]: any) => {
    //   formData.append(key, value)
    // })

    // const upload = await fetch(url, {
    //   method: "POST",
    //   body: formData,
    // })

    // if (upload.ok) {
    //   console.log("Uploaded successfully!")
    //
    // } else {
    //   console.error("Upload failed.")
    // }
  }

  return (
    <div>
      {fileNameInput.value ? (
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <p>{fileNameInput.value}</p>
          <IconButton
            onClick={removeFile}
            aria-label="delete"
            icon={<AiFillDelete />}
            colorScheme="red"
            isLoading={isLoadingDelete}
          />
          <input {...input} hidden />
        </div>
      ) : (
        <div>
          {isLoading && <Progress size="xs" isIndeterminate />}
          <input
            type="file"
            ref={ref}
            onChange={uploadFile}
            className="block w-full mb-5 mx-auto max-w-sm text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-xl file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          "
          />
        </div>
      )}
    </div>
  )
}

export default UploadFile
