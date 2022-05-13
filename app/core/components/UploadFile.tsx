import React, { useEffect, useState } from "react"
import createFile from "app/file/mutations/createFile"
import { useMutation, useParam } from "blitz"
import { getFileName } from "app/common"
import { IconButton, Progress } from "@chakra-ui/react"
import { AiFillDelete } from "react-icons/ai"
import { useField } from "react-final-form"
import deleteFile from "app/file/mutations/deleteFile"
import GetPreSignUrl from "app/documents/mutations/GetPreSignUrl"
import DeleteKeyFromSpace from "app/documents/mutations/DeleteKeyFromSpace"
import axios from "axios"

import { File } from "@prisma/client"
import { toast } from "app/pages/_app"

const UploadFile = ({ name }: { name: string }) => {
  const enquiryId = useParam("enquiryId", "number")
  const [createFileMutation, { isLoading }] = useMutation(createFile)
  const [DeleteFileMutation, { isLoading: isLoadingDelete }] = useMutation(deleteFile)
  const [GetPreSignUrlMutation, { isLoading: isLoadingUrl }] = useMutation(GetPreSignUrl)
  const [DeleteKeyFromSpaceMutation, { isLoading: isLoadingDeleteUrl }] =
    useMutation(DeleteKeyFromSpace)
  const { input } = useField("fileId", {})
  const { input: fileNameInput } = useField<File>("file", {})
  const [isUploading, setIsUploading] = useState(false)

  const ref = React.useRef<HTMLInputElement>()

  const removeFile = async (id: number, key: string) => {
    await DeleteFileMutation({ id: id })
    await DeleteKeyFromSpaceMutation({ key: key })
    input.onChange(null)
    fileNameInput.onChange(null)
  }

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setIsUploading(true)
    const file = e.target.files[0]
    const key = getFileName(enquiryId, name, file.name)

    const formData = new FormData()
    Object.entries({ file: e.target.files[0] }).forEach(([key, value]: any) => {
      formData.append(key, value)
    })

    const url = await GetPreSignUrlMutation({ key: key })

    if (url) {
      await axios
        .put(url, formData)
        .then(async () => {
          const fileId = await createFileMutation({ key: key, name: file.name })
          input.onChange(fileId.id)
          fileNameInput.onChange(file)
          toast({
            title: "uploaded file successfully.",
            status: "success",
            isClosable: true,
          })
        })
        .catch((err) => {
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

    setIsUploading(true)
  }

  return (
    <div>
      {fileNameInput?.value?.name ? (
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <p>{fileNameInput.value.name}</p>
          <IconButton
            onClick={() => removeFile(fileNameInput.value.id, fileNameInput.value.key)}
            aria-label="delete"
            icon={<AiFillDelete />}
            colorScheme="red"
            isLoading={isLoadingDelete || isLoadingDeleteUrl}
          />
          <input {...input} hidden />
        </div>
      ) : (
        <div>
          {isLoading || (isUploading && <Progress size="xs" isIndeterminate />)}
          <input
            type="file"
            ref={ref}
            disabled={isUploading}
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
