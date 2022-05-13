import { useMutation, BlitzPage, Routes } from "blitz"
import createChannelPartner from "app/channel-partners/mutations/createChannelPartner"
import { ChannelPartnerForm, FORM_ERROR } from "app/channel-partners/components/ChannelPartnerForm"
import { CreateChannelPartner } from "app/auth/validations"
import { useState } from "react"
import { Divider } from "@chakra-ui/react"

import { Box, Heading } from "@chakra-ui/react"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { toast } from "../_app"
const NewChannelPartnerPage: BlitzPage = () => {
  const [createChannelPartnerMutation] = useMutation(createChannelPartner)
  const [completed, setCompleted] = useState(false)

  return (
    <div className="max-w-xl mx-auto p-5">
      {completed ? (
        <Box textAlign="center" py={10} px={6}>
          <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Thank you for Applying
          </Heading>
        </Box>
      ) : (
        <>
          <h1 className="text-3xl font-medium text-center">Partner with Us</h1>
          <Divider my={4} />
          <ChannelPartnerForm
            submitText="Partner with Us"
            schema={CreateChannelPartner}
            onSubmit={async (values: any) => {
              if (!values.isVerifiedPhone) {
                toast({
                  title: "Please verify your phone number.",
                  status: "error",
                  isClosable: true,
                })
                return
              }
              try {
                await createChannelPartnerMutation(values)
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

export default NewChannelPartnerPage
