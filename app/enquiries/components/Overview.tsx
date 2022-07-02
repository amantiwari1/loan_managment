import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Divider,
} from "@chakra-ui/react"
import React from "react"
import { BiMap, BiRupee, BiUser } from "react-icons/bi"
import { BsStar, BsTelephone } from "react-icons/bs"
import { MdOutlineAlternateEmail } from "react-icons/md"

import { Box, Heading, Text } from "@chakra-ui/react"
import { Router, Routes, useMutation, useParam, useQuery, useRouter, useSession } from "blitz"
import getEnquiry from "../queries/getEnquiry"
import PartnerSelect from "./PartnerSelect"
import CustomerSelect from "./CustomerSelect"
import StaffSelect from "./StaffSelect"
import { client_service_options, client_occupations_type_options } from "app/common"
import { Button } from "app/core/components/Button"
import updateEnquiryRequest from "../mutations/updateEnquiryRequest"

const Overview = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry, { refetch }] = useQuery(
    getEnquiry,
    { id: enquiryId },
    {
      refetchOnWindowFocus: false,
    }
  )
  const session = useSession()

  const data = [
    {
      name: "Primary Applicant",
      content: enquiry.client_name,
      icon: BiUser,
    },
    {
      name: "Client Mobile",
      content: enquiry.client_mobile.toString(),
      icon: BsTelephone,
    },
    {
      name: "Client Email",
      content: enquiry.client_email,
      icon: MdOutlineAlternateEmail,
    },
    {
      name: "Client Address",
      content: enquiry.client_address,
      icon: BiMap,
    },
    {
      name: "Client Occupation type",
      content: client_occupations_type_options[enquiry.client_qccupation_type],
      icon: BsStar,
    },
    {
      name: "Client Service",
      content: client_service_options[enquiry.client_service],
      icon: BiUser,
    },
    {
      name: "Loan Amount",
      content: "₹" + enquiry.loan_amount.toString(),
      icon: BiRupee,
    },
    {
      name: "Client",
      content: enquiry?.customer?.user?.name ?? "Not Selected",
      icon: BiUser,
    },
  ]

  const MessageRequest = {
    PENDING: "This enquiry is pending approved request  ",
    REJECTED: "This enquiry is rejected",
    SANCTIONED: "This enquiry is sanctioned",
  }

  return (
    <Box backgroundColor="white" p={5}>
      <div className="flex gap-5">
        <Heading as="h4" size="md">
          Enquiry Overview
        </Heading>

        <CloseEquiry request={enquiry.enquiry_request} />
      </div>

      <Divider my={4} />
      {enquiry.enquiry_request === "APPROVED" ? (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            {data.map((item, i) => (
              <div key={i}>
                <div className="flex space-x-2 items-center">
                  <div>
                    <div className="bg-green-200 text-blue-500 text-xl p-2 rounded-full">
                      <item.icon />
                    </div>
                  </div>
                  <div>
                    <Text fontWeight="medium">{item.content}</Text>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.500"
                      textTransform="capitalize"
                    >
                      {item.name}
                    </Text>
                  </div>
                </div>
                <Divider my={4} />
              </div>
            ))}
          </div>

          <div>
            {["USER", "PARTNER"].includes(session.role as string) ? (
              <></>
            ) : (
              <div className="space-y-5">
                <PartnerSelect
                  enquiry={enquiry}
                  refetch={refetch}
                  PartnerEnquiry={enquiry?.partner?.map((arr) => {
                    return {
                      label: arr.user.name,
                      value: arr.user.id,
                    }
                  })}
                />
                <CustomerSelect enquiry={enquiry} refetch={refetch} />
                <StaffSelect
                  enquiry={enquiry}
                  refetch={refetch}
                  StaffEnquiry={enquiry?.staff?.map((arr) => {
                    return {
                      label: arr.user.name,
                      value: arr.user.id,
                    }
                  })}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p>{MessageRequest[enquiry.enquiry_request]}</p>
        </div>
      )}
    </Box>
  )
}

const CloseEquiry = ({ request }: { request: string }) => {
  const [updateEnquiryMutation, { isLoading }] = useMutation(updateEnquiryRequest)
  const enquiryId = Number(useParam("enquiryId", "number"))
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const onAlertClose = () => setIsAlertOpen(false)
  const onAlertOpen = () => setIsAlertOpen(true)

  const firstField = React.useRef(null)
  // router
  const router = useRouter()

  if (request === "PENDING") {
    return <></>
  }

  return (
    <>
      <Button w={200} onClick={onAlertOpen} isLoading={isLoading} colorScheme="Customblue">
        {request === "REJECTED" || request === "SANCTIONED" ? "Approve Enquiry" : "Close Enquiry"}
      </Button>
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={firstField} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {request === "REJECTED" || request === "SANCTIONED"
                ? "Approve Enquiry"
                : "Close Enquiry"}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to close this enquiry? You can&apos;t undo this action
              afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button size="sm" ref={firstField} variant="outline" onClick={onAlertClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                isLoading={isLoading}
                onClick={async () => {
                  await updateEnquiryMutation({
                    isNew: false,
                    id: enquiryId,
                    enquiry_request:
                      request === "REJECTED" || request === "SANCTIONED" ? "APPROVED" : "REJECTED",
                  })

                  router.push(Routes.Home())
                  onAlertClose()
                }}
                ml={3}
              >
                {request === "REJECTED" || request === "SANCTIONED"
                  ? "Approve Enquiry"
                  : "Close Enquiry"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Overview
