import { Enquiry } from "@prisma/client"
import { Card, Divider } from "antd"
import React, { useState } from "react"
import Select from "react-select"

import { Text } from "@chakra-ui/react"
import { useMutation, useParam, useQuery, useSession } from "blitz"
import getUsers from "app/users/queries/getUsers"
import { Button } from "app/core/components/Button"
import addPartnerEnquiry from "../mutations/addPartnerEnquiry"
import getEnquiry from "../queries/getEnquiry"
import addCustomerEnquiry from "../mutations/addCustomerEnquiry"

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
  const [addPartnerMutation, { isLoading: partnerLoading }] = useMutation(addPartnerEnquiry)
  const [addCustomerMutation, { isLoading: customerLoading }] = useMutation(addCustomerEnquiry)
  const [partner] = useQuery(
    getUsers,
    {
      where: {
        role: "PARTNER",
      },
    },
    {
      enabled: session.role !== "USER",
    }
  )
  const [customer] = useQuery(
    getUsers,
    {
      where: {
        role: "USER",
      },
    },
    {
      enabled: session.role !== "USER",
    }
  )

  const data = [
    {
      name: "Client Name",
      content: enquiry.client_name,
      icon: "",
    },
    {
      name: "Client Mobile",
      content: enquiry.client_mobile.toString(),
      icon: "",
    },
    {
      name: "Client Address",
      content: enquiry.client_address,
      icon: "",
    },
    {
      name: "Client Occupation type",
      content: client_qccupation_type_options[enquiry.client_qccupation_type],
      icon: "",
    },
    {
      name: "Client Service",
      content: client_service_options[enquiry.client_service],
      icon: "",
    },
    {
      name: "Loan Amount",
      content: "₹" + enquiry.loan_amount.toString(),
      icon: "",
    },
    {
      name: "Partner",
      content: enquiry?.partner?.user?.name ?? "Not Selected",
      icon: "",
    },
    {
      name: "Customer",
      content: enquiry?.customer?.user?.name ?? "Not Selected",
      icon: "",
    },
  ]

  const [Partner, setPartner] = useState<number | undefined>(undefined)
  const [Customer, setCustomer] = useState<number | undefined>(undefined)

  return (
    <div>
      <Card title="Enquiry Overview">
        {session.role === "USER" ? (
          <></>
        ) : (
          <>
            <Text fontSize="sm">Partner :</Text>
            <div className="flex space-x-2 max-w-sm mb-4">
              <div className="w-[40rem]">
                <Select
                  onChange={(data) => {
                    setPartner(data?.value)
                  }}
                  defaultValue={{
                    value: enquiry?.partner?.user?.id,
                    label: enquiry?.partner?.user?.name,
                  }}
                  options={partner?.users.map((item) => {
                    return {
                      value: item.id,
                      label: item.name,
                    }
                  })}
                />
              </div>
              <Button
                isLoading={partnerLoading}
                onClick={() => {
                  addPartnerMutation({
                    id: enquiry.id,
                    userId: Partner,
                  })
                }}
              >
                Update Partner
              </Button>
            </div>
            <Text fontSize="sm">Customer :</Text>
            <div className="flex space-x-2 max-w-sm mb-4">
              <div className="w-[40rem]">
                <Select
                  onChange={(data) => {
                    setCustomer(data?.value)
                  }}
                  defaultValue={{
                    value: enquiry?.customer?.user?.id,
                    label: enquiry?.customer?.user?.name,
                  }}
                  options={customer.users.map((item) => {
                    return {
                      value: item.id,
                      label: item.name,
                    }
                  })}
                />
              </div>
              <Button
                isLoading={customerLoading}
                onClick={() => {
                  addCustomerMutation({
                    id: enquiry.id,
                    userId: Customer,
                  })
                }}
              >
                Update customer
              </Button>
            </div>
          </>
        )}
        {data.map((item, i) => (
          <div key={i}>
            <Text fontSize="sm">{item.name}:</Text>
            <Text fontSize="xl">{item.content}</Text>
            <Divider />
          </div>
        ))}
      </Card>
    </div>
  )
}

export default Overview
