import { useMutation, BlitzPage } from "blitz"
import createEnquiry from "app/enquiries/mutations/createEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"
import { Divider, message, Result } from "antd"
import { CreateEnquiry } from "app/auth/validations"
import { useState } from "react"
import { SmileOutlined } from "@ant-design/icons"

const NewPublicEnquiryPage: BlitzPage = () => {
  const [createEnquiryMutation] = useMutation(createEnquiry)
  const [completed, setCompleted] = useState(false)

  return (
    <div className="max-w-xl mx-auto p-5">
      {completed ? (
        <Result icon={<SmileOutlined />} title="Thank you for Applying" />
      ) : (
        <>
          <h1 className="text-3xl font-medium text-center">Apply Loan</h1>
          <Divider />
          <EnquiryForm
            submitText="Apply"
            schema={CreateEnquiry}
            onSubmit={async (values: any) => {
              if (!values.isVerifiedPhone) {
                message.error("Please verify your phone number")
                return
              }
              try {
                await createEnquiryMutation(values)
                setCompleted(true)
              } catch (error: any) {
                if (error.code === "P2002" && error.meta?.target?.includes("client_email")) {
                  return { client_email: "This email is already being used" }
                } else {
                  return { [FORM_ERROR]: error.toString() }
                }
              }
            }}
          />
        </>
      )}
    </div>
  )
}

export default NewPublicEnquiryPage
