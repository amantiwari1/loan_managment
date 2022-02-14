import { Teaser } from "@prisma/client"
import { message } from "antd"
import { Button } from "app/core/components/Button"
import getRelationshipEnquiry from "app/enquiries/queries/getRelationshipEnquiry"
import { Ctx, useMutation, useParam, useQuery } from "blitz"
import { FORM_ERROR } from "final-form"
import jsPDF from "jspdf"
import React, { useState } from "react"
import { BiExport } from "react-icons/bi"
import createTeaser from "../mutations/createTeaser"
import updateTeaser from "../mutations/updateTeaser"
import ExportToHtml from "./ExportToHtml"
import { MSMETeaserForm } from "./MSMETeaserForm"
interface CustomRelationshipEnquiry {
  id: number
  // Teaser: Teaser
  Teaser: any
}
const Teasers = () => {
  const enquiryId = useParam("enquiryId", "number")
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
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  const GeneratePDF = (name: string) => {
    setIsLoadingExport(true)
    const doc = new jsPDF("p", "pt", "a4")
    const element = document.getElementById("PDF_TEASER")
    doc.html(element, {
      callback: function (doc) {
        doc.save(`MSME Teaser ${name} (kred Partner).pdf`)
        setIsLoadingExport(false)
      },
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-end">
        <Button
          onClick={() => GeneratePDF((enquiry.Teaser?.data?.name as any) ?? "")}
          variant="outline"
          className="ml-auto"
          leftIcon={<BiExport />}
          w={200}
          isLoading={isLoadingExport}
        >
          Export PDF
        </Button>
      </div>
      <ExportToHtml data={(enquiry.Teaser?.data as any) ?? {}} />
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
            message.success("Updated Teaser")
          }
        }}
      />
    </div>
  )
}

export default Teasers
