import { Button } from "app/core/components/Button"
import getRelationshipEnquiry from "app/enquiries/queries/getRelationshipEnquiry"
import { Ctx, useMutation, useParam, useQuery } from "blitz"
import { FORM_ERROR } from "final-form"
import React, { useState } from "react"
import { BiExport } from "react-icons/bi"
import createTeaser from "../mutations/createTeaser"
import updateTeaser from "../mutations/updateTeaser"
import { MSMETeaserForm } from "./MSMETeaserForm"
import { RetailTeaserForm } from "./RetailTeaserForm"
import pdfMake from "pdfmake/build/pdfmake.js"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { MSMEJsonTable, RetailsJsonTable } from "./ConvertToTableData"
import { toast } from "app/pages/_app"

// import { saveAs } from "file-saver"
// import { BorderStyle, ImageRun, Packer } from "docx"

pdfMake.vfs = pdfFonts.pdfMake.vfs

if (typeof window !== "undefined") {
  pdfMake.fonts = {
    DDIN: {
      normal: `${window.location.origin}/trebuc.ttf`,
      bold: `${window.location.origin}/trebucb.ttf`,
      italics: `${window.location.origin}/trebuci.ttf`,
    },
  }
}

interface CustomRelationshipEnquiry {
  id: number
  // Teaser: Teaser
  Teaser: any
  client_service: string
}

const Teasers = () => {
  const enquiryId = Number(useParam("enquiryId", "number"))
  const [createTeaserMutation] = useMutation(createTeaser)
  const [updateTeaserMutation] = useMutation(updateTeaser)
  const [isLoadingExport, setIsLoadingExport] = useState(false)
  const [enquiry, { refetch }] = useQuery<
    (
      input: {
        id?: number
        select?: unknown
      },
      ctx: Ctx
    ) => Promise<CustomRelationshipEnquiry>,
    CustomRelationshipEnquiry,
    unknown,
    CustomRelationshipEnquiry
  >(
    getRelationshipEnquiry as any,
    {
      id: enquiryId,
      select: {
        id: true,
        Teaser: true,
        client_service: true,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  const GeneratePDF = async (name: string) => {
    setIsLoadingExport(true)
    try {
      if (!enquiry?.Teaser?.data) {
        toast({
          title: "Failed to export pdf due to incomplete form.",
          status: "error",
          isClosable: true,
        })
        return
      }

      if (["HOME_LOAN", "MORTGAGE_LOAN"].includes(enquiry.client_service)) {
        const data = RetailsJsonTable(enquiry?.Teaser?.data)
        pdfMake.createPdf(data as any).download(`Retail Teaser ${enquiryId}`)
      } else {
        const data = MSMEJsonTable(enquiry?.Teaser?.data)
        pdfMake.createPdf(data as any).download(`MSME Teaser ${enquiryId}`)
      }
    } catch (err) {
      toast({
        title: "Failed to export pdf due to incomplete form.",
        status: "error",
        isClosable: true,
      })
    } finally {
      setIsLoadingExport(false)
    }
  }

  // const GenerateWord = async (name: string) => {
  //   try {
  //     if (!enquiry?.Teaser?.data) {
  //       toast({
  //         title: "Failed to export pdf due to incomplete form.",
  //         status: "error",
  //         isClosable: true,
  //       })
  //       return
  //     }

  //     if (["HOME_LOAN", "MORTGAGE_LOAN"].includes(enquiry.client_service)) {
  //     } else {
  //     }

  //     const letterHead = await fetch("/logo.png")

  //     const BordersCell = {
  //       bottom: {
  //         style: BorderStyle.TRIPLE,
  //         size: 10,
  //         color: "#000000",
  //       },
  //       left: {
  //         style: BorderStyle.TRIPLE,
  //         size: 10,
  //         color: "#000000",
  //       },
  //       right: {
  //         style: BorderStyle.TRIPLE,
  //         size: 10,
  //         color: "#000000",
  //       },
  //       top: {
  //         style: BorderStyle.TRIPLE,
  //         size: 10,
  //         color: "#000000",
  //       },
  //     }

  //     const iamgereal = await letterHead.arrayBuffer()
  //     console.log("🚀 ~ file: Teasers.tsx ~ line 113 ~ GenerateWord ~ iamgereal", iamgereal)
  //     const Image = new ImageRun({
  //       data: iamgereal,
  //       floating: {
  //         horizontalPosition: {
  //           offset: 6014400,
  //         },
  //         verticalPosition: {
  //           offset: 0,
  //         },
  //       },
  //       transformation: {
  //         width: 100,
  //         height: 20,
  //       },
  //     })

  //     Packer.toBlob(doc).then((blob) => {
  //       console.log(blob)
  //       saveAs(blob, "example.docx")
  //       console.log("Document created successfully")
  //     })
  //   } catch (err) {
  //     console.log(err)

  //     toast({
  //       title: "Failed to export pdf due to incomplete form.",
  //       status: "error",
  //       isClosable: true,
  //     })
  //   }
  // }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-center">
        <Button
          onClick={() => GeneratePDF("")}
          variant="outline"
          className="ml-auto"
          leftIcon={<BiExport />}
          w={200}
          isLoading={isLoadingExport}
        >
          Export PDF
        </Button>

        {/* <Button
          onClick={() => GenerateWord("")}
          variant="outline"
          className="ml-auto"
          leftIcon={<BiExport />}
          w={200}
          isLoading={isLoadingExport}
        >
          Export Word
        </Button> */}
      </div>
      {["HOME_LOAN", "MORTGAGE_LOAN"].includes(enquiry.client_service) ? (
        <>
          <p className="text-2xl text-center">Retail Teaser</p>
          <RetailTeaserForm
            submitText="Save Teaser"
            // schema={CreateTeaser}
            initialValues={(enquiry.Teaser?.data as any) ?? {}}
            onSubmit={async (values) => {
              try {
                if (!enquiry?.Teaser?.id) {
                  await createTeaserMutation({
                    data: values,
                    enquiryId: enquiryId,
                  })
                } else {
                  await updateTeaserMutation({
                    id: enquiry.Teaser.id,
                    data: values,
                  })
                }
                refetch()
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              } finally {
                toast({
                  title: "Updated",
                  status: "success",
                  isClosable: true,
                })
              }
            }}
          />
        </>
      ) : (
        <>
          <p className="text-2xl text-center">MSME Teaser</p>
          <MSMETeaserForm
            submitText="Save Teaser"
            // TODO use a zod schema for form validation
            // schema={CreateTeaser}
            initialValues={(enquiry.Teaser?.data as any) ?? {}}
            onSubmit={async (values) => {
              try {
                if (!enquiry?.Teaser?.id) {
                  const teaser = await createTeaserMutation({
                    data: values,
                    enquiryId: enquiryId,
                  })
                } else {
                  await updateTeaserMutation({
                    id: enquiry.Teaser.id,
                    data: values,
                  })
                }
                refetch()
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              } finally {
                toast({
                  title: "Updated",
                  status: "success",
                  isClosable: true,
                })
              }
            }}
          />
        </>
      )}
    </div>
  )
}

export default Teasers
