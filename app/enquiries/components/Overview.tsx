import { Enquiry } from "@prisma/client"
import { Card, Divider } from "antd"
import React, { useState } from "react"
import Select from "react-select"
import { BiEdit, BiMap, BiRupee, BiUser } from "react-icons/bi"
import { BsStar, BsTelephone } from "react-icons/bs"
import { MdOutlineAlternateEmail } from "react-icons/md"
import { FiUsers } from "react-icons/fi"

import { Text } from "@chakra-ui/react"
import { useMutation, useParam, useQuery, useSession } from "blitz"
import getUsers from "app/users/queries/getUsers"
import { Button } from "app/core/components/Button"
import addPartnerEnquiry from "../mutations/addPartnerEnquiry"
import getEnquiry from "../queries/getEnquiry"
import addCustomerEnquiry from "../mutations/addCustomerEnquiry"
import PartnerSelect from "./PartnerSelect"
import CustomerSelect from "./CustomerSelect"

const client_service_options = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "MORTGAGE_LOAN", label: "Mortgage Loan" },
  { value: "UNSECURED_LOAN", label: "Unsecured Loan" },
  { value: "MSME_LOAN", label: "MSME Loan" },
  { value: "STARTUP_LOAN", label: "Startup Loan" },
  { value: "SUBSIDY_SCHEMES", label: "Subsidy Schemes" },
].reduce((obj, item) => Object.assign(obj, { [item.value]: item.label }), {})

const client_qccupation_type_options = [
  { value: "SALARIED_INDIVIDUAL", label: "Salaried Individual" },
  { value: "INDIVIDUAL", label: "Individual" },
  {
    value: "SELF_EMPLOYED_INDIVIDUAL_OR_PROPRIETORSHIP",
    label: "Self Employed Individual / Proprietorship",
  },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "COMPANY", label: "Company" },
].reduce((obj, item) => Object.assign(obj, { [item.value]: item.label }), {})

const Overview = () => {
  const enquiryId = useParam("enquiryId", "number")
  const [enquiry] = useQuery(getEnquiry, { id: enquiryId })
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
      content: client_qccupation_type_options[enquiry.client_qccupation_type],
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
      name: "Partner",
      content: enquiry?.partner?.user?.name ?? "Not Selected",
      icon: FiUsers,
    },
    {
      name: "Client",
      content: enquiry?.customer?.user?.name ?? "Not Selected",
      icon: BiUser,
    },
  ]

  return (
    <Card title="Enquiry Overview">
      <div className="grid grid-cols-2 gap-5">
        <div>
          {data.map((item, i) => (
            <div key={i}>
              <div className="flex space-x-2 items-center">
                <div>
                  <div className="bg-blue-200 text-blue-500 text-xl p-2 rounded-full">
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
              <Divider />
            </div>
          ))}
        </div>

        <div>
          {["USER", "PARTNER"].includes(session.role as string) ? (
            <></>
          ) : (
            <div className="space-y-5">
              <PartnerSelect enquiry={enquiry} />
              <CustomerSelect enquiry={enquiry} />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Overview
