import { useMutation, BlitzPage } from "blitz"
import createEnquiry from "app/enquiries/mutations/createEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"
import { Divider } from "@chakra-ui/react"
import { CreateEnquiry } from "app/auth/validations"
import { useState } from "react"
import { toast } from "../_app"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { Box, Heading } from "@chakra-ui/react"

const NewPublicEnquiryPage: BlitzPage = () => {
  const [createEnquiryMutation] = useMutation(createEnquiry)
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
          <h1 className="text-3xl font-medium text-center">Apply Loan</h1>
          <Divider my={4} />
          <EnquiryForm
            submitText="Apply"
            schema={CreateEnquiry}
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
