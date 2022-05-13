import React, { useEffect, useState } from "react"
import createFile from "app/file/mutations/createFile"
import { getAntiCSRFToken, useMutation, useParam, useQuery } from "blitz"
import { getFileName } from "app/common"
import { IconButton, Progress } from "@chakra-ui/react"
import { AiFillDelete } from "react-icons/ai"
import { useField } from "react-final-form"
import getFile from "app/file/queries/getFile"
import deleteFile from "app/file/mutations/deleteFile"
import createMultiFile from "app/file/mutations/createMultiFile"
import { File } from "@prisma/client"
import { FieldArray } from "react-final-form-arrays"
import { Field } from "react-final-form"
import GetPreSignUrl from "app/documents/mutations/GetPreSignUrl"

import axios from "axios"
import DeleteKeyFromSpace from "app/documents/mutations/DeleteKeyFromSpace"
import { toast } from "app/pages/_app"

const MultiUploadFile = ({ name }: { name: string }) => {
  const enquiryId = useParam("enquiryId", "number")
  const [createFileMutation, { isLoading }] = useMutation(createMultiFile)
  const [DeleteFileMutation, { isLoading: isLoadingDelete }] = useMutation(deleteFile)
  const [GetPreSignUrlMutation, { isLoading: isLoadingUrl }] = useMutation(GetPreSignUrl)
  const [DeleteKeyFromSpaceMutation, { isLoading: isLoadingDeleteUrl }] =
    useMutation(DeleteKeyFromSpace)
  const [isUploading, setIsUploading] = useState(false)
  const { input } = useField<File[]>("file", {})

  const ref = React.useRef<HTMLInputElement>()

  const removeFile = async (id: number, key: string) => {
    await DeleteKeyFromSpaceMutation({ key: key })
    await DeleteFileMutation({ id: id })
    input.onChange(input.value.filter((arr) => arr.id !== id))
  }

  const uploadFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setIsUploading(true)
    const files = []
    for (let i = 0; i < e.target.files.length; i++) {
      const key = getFileName(enquiryId, name, e.target.files[i].name)
      files.push({
        key: key,
        name: e.target.files[i].name,
      })
      const url = await GetPreSignUrlMutation({ key: key })
      const formData = new FormData()
      Object.entries({ file: e.target.files[i] }).forEach(([key, value]: any) => {
        formData.append(key, value)
      })
      if (url) {
        await axios
          .put(url, formData)
          .then(() =>
            toast({
              title: "uploaded file successfully.",
              status: "success",
              isClosable: true,
            })
          )
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
    }

    const fileId = await createFileMutation({ files: files })
    input.onChange(fileId)
    setIsUploading(false)
  }

  return (
    <div>
      {input.value && input.value.length > 0 ? (
        <>
          {input.value.map((i, key) => (
            <div className="flex justify-between items-center max-w-sm mx-auto mt-1" key={key}>
              <p>{i.name}</p>
              <IconButton
                onClick={() => removeFile(i.id, i.key)}
                aria-label="delete"
                icon={<AiFillDelete />}
                colorScheme="red"
                isLoading={isLoadingDelete}
              />
            </div>
          ))}

          <div className="hidden">
            <FieldArray name={`file`}>
              {({ fields }) => (
                <>
                  {fields.map((name, index) => (
                    <Field name={`${name}.id`} key={index} component="input" />
                  ))}
                </>
              )}
            </FieldArray>
          </div>
        </>
      ) : (
        <div>
          {(isLoading || isUploading) && <Progress size="xs" isIndeterminate />}
          <input
            multiple
            disabled={isUploading}
            type="file"
            accept="application/pdf"
            ref={ref}
            onChange={uploadFile}
            className="block w-full mb-5 mx-auto max-w-sm text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-xl file:font-semibold file:text-white
          file:bg-blue-50 
          hover:file:bg-blue-100
          "
          />
        </div>
      )}
    </div>
  )
}

export default MultiUploadFile
