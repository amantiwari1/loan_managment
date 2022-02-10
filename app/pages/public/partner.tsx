import { useMutation, BlitzPage, Routes } from "blitz"
import createChannelPartner from "app/channel-partners/mutations/createChannelPartner"
import { ChannelPartnerForm, FORM_ERROR } from "app/channel-partners/components/ChannelPartnerForm"
import { CreateChannelPartner } from "app/auth/validations"
import { useState } from "react"
import { Divider, Result } from "antd"

import { SmileOutlined } from "@ant-design/icons"
const NewChannelPartnerPage: BlitzPage = () => {
  const [createChannelPartnerMutation] = useMutation(createChannelPartner)
  const [completed, setCompleted] = useState(false)

  return (
    <div className="max-w-xl mx-auto p-5">
      {completed ? (
        <Result icon={<SmileOutlined />} title="Thank you for Applying" />
      ) : (
        <>
          <h1 className="text-3xl font-medium text-center">Partner with Us</h1>
          <Divider />
          <ChannelPartnerForm
            submitText="Partner with Us"
            schema={CreateChannelPartner}
            onSubmit={async (values) => {
              try {
                await createChannelPartnerMutation(values)
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

export default NewChannelPartnerPage
