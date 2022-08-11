import { useMutation, BlitzPage } from "blitz"
import createEnquiry from "app/enquiries/mutations/createEnquiry"
import { EnquiryForm, FORM_ERROR } from "app/enquiries/components/EnquiryForm"
import { Divider } from "@chakra-ui/react"
import { CreateEnquiry, CreatePublicEnquiry } from "app/auth/validations"
import { useState } from "react"
import { toast } from "../_app"
import { ArrowBackIcon, CheckCircleIcon } from "@chakra-ui/icons"
import { Box, Heading } from "@chakra-ui/react"
import { EnquiryPublicForm } from "app/enquiries/components/EnquiryPublicForm"
import { Button } from "app/core/components/Button"

const data = [
  "Home loan",
  "Mortgage Loan",
  "Unsecured Loan",
  "MSME Loan",
  "Start up Loan",
  "Subsidy Schemes",
]

const NewPublicEnquiryPage: BlitzPage = () => {
  const [createEnquiryMutation] = useMutation(createEnquiry)
  const [completed, setCompleted] = useState(false)

  return (
    <div
      className="bg-center bg-cover bg-no-repeat bg-fixed  "
      style={{
        backgroundImage: "url(https://kredpartner.com/public/asset/img/about/about-banner.png)",
      }}
    >
      <div className="bg-[#5348a4]/80">
        <div className="max-w-6xl mx-auto min-h-screen">
          {completed ? (
            <div className="min-h-screen flex justify-center items-center">
              <Box textAlign="center" py={10} px={6}>
                <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
                <Heading as="h2" size="xl" mt={6} mb={2} color="white">
                  Thank you for Applying
                </Heading>
                <Button w="36" mb="10" colorScheme="Customgreen">
                  <div className="flex gap-2 items-center">
                    <div>
                      <ArrowBackIcon boxSize={"16px"} />
                    </div>
                    <p>Back to Home</p>
                  </div>
                </Button>
              </Box>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 py-5 md:py-0  px-5  justify-center items-center min-h-screen">
              <div className="h-full py-4 md:py-44 px-5">
                <div className="!text-white">
                  <a href="https://kredpartner.com">
                    <Button w="36" mb="10" colorScheme="Customgreen">
                      <div className="flex gap-2 items-center">
                        <div>
                          <ArrowBackIcon boxSize={"16px"} />
                        </div>
                        <p>Back to Home</p>
                      </div>
                    </Button>
                  </a>
                  <h1 className="text-3xl mb-2 font-bold">Our Service</h1>
                  <ul className="space-y-4">
                    {data.map((value) => (
                      <li key={value} className="flex gap-3">
                        <div>
                          <CheckCircleIcon />
                        </div>

                        <div className="text-xl font-medium">{value}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-center px-5">
                <div className="bg-[#03085a] p-5 rounded-xl md:max-w-md">
                  <h1 className="text-2xl text-center font-bold text-white">
                    APPLY FOR INSTANT LOAN
                  </h1>

                  <div className="!text-xs">
                    <div>
                      <EnquiryPublicForm
                        buttonColor="green"
                        submitText="Submit"
                        schema={CreatePublicEnquiry}
                        onSubmit={async (values: any) => {
                          console.log(values)
                          if (!values.isVerifiedPhone) {
                            toast({
                              title: "Please verify your phone number.",
                              status: "error",
                              isClosable: true,
                            })
                            return
                          }
                          try {
                            await createEnquiryMutation({ ...values, private_enquiry: false })
                            setCompleted(true)
                          } catch (error: any) {
                            if (
                              error.code === "P2002" &&
                              error.meta?.target?.includes("client_email")
                            ) {
                              return { client_email: "This email is already being used" }
                            } else {
                              return { [FORM_ERROR]: error.toString() }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewPublicEnquiryPage
