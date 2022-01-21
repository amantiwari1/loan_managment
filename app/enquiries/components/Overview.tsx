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
      enabled: !["USER", "PARTNER"].includes(session.role as string),
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
      enabled: !["USER", "PARTNER"].includes(session.role as string),
    }
  )
  const [staff] = useQuery(
    getUsers,
    {
      where: {
        role: "STAFF",
      },
    },
    {
      enabled: !["USER", "PARTNER"].includes(session.role as string),
    }
  )

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

  const [Partner, setPartner] = useState<number | undefined>(undefined)
  const [Customer, setCustomer] = useState<number | undefined>(undefined)
  const [Staff, setStaff] = useState<number | undefined>(undefined)
  const [Edit, setEdit] = useState<string>("")

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
              <div>
                <Text fontSize="sm">Partner :</Text>
                {Edit === "PARTNER" ? (
                  <div className="flex space-x-2 max-w-xl mb-4">
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
                      onClick={async () => {
                        await addPartnerMutation({
                          id: enquiry.id,
                          userId: Partner as number,
                        })
                        setEdit("")
                      }}
                    >
                      Change Partner
                    </Button>
                    <Button
                      onClick={() => {
                        setEdit("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2 font-medium items-center">
                    <Text fontSize="2xl">{enquiry?.partner?.user?.name ?? "Not Selected"} </Text>
                    <div className="text-2xl cursor-pointer">
                      <BiEdit onClick={() => setEdit("PARTNER")} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Text fontSize="sm">Primary Applicant :</Text>
                {Edit === "USER" ? (
                  <div className="flex space-x-2 max-w-xl mb-4">
                    <div className="w-[40rem]">
                      <Select
                        onChange={(data) => {
                          setCustomer(data?.value)
                        }}
                        defaultValue={{
                          value: enquiry?.customer?.user?.id,
                          label: enquiry?.customer?.user?.name,
                        }}
                        options={customer?.users.map((item) => {
                          return {
                            value: item.id,
                            label: item.name,
                          }
                        })}
                      />
                    </div>
                    <Button
                      isLoading={customerLoading}
                      onClick={async () => {
                        await addCustomerMutation({
                          id: enquiry.id,
                          userId: Customer as number,
                        })
                        setEdit("")
                      }}
                    >
                      Change customer
                    </Button>
                    <Button
                      onClick={() => {
                        setEdit("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2 font-medium items-center">
                    <Text fontSize="2xl">{enquiry?.customer?.user?.name ?? "Not Selected"} </Text>
                    <div className="text-2xl cursor-pointer">
                      <BiEdit onClick={() => setEdit("USER")} />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Text fontSize="sm">Staff :</Text>
                {Edit === "STAFF" ? (
                  <div className="flex space-x-2 max-w-xl mb-4">
                    <div className="w-[40rem]">
                      <Select
                        onChange={(data) => {
                          setStaff(data?.value)
                        }}
                        defaultValue={{
                          value: enquiry?.staff?.user?.id,
                          label: enquiry?.staff?.user?.name,
                        }}
                        options={staff?.users.map((item) => {
                          return {
                            value: item.id,
                            label: item.name,
                          }
                        })}
                      />
                    </div>
                    <Button
                      isLoading={customerLoading}
                      onClick={async () => {
                        // await addCustomerMutation({
                        //   id: enquiry.id,
                        //   userId: Customer as number,
                        // })
                        setEdit("")
                      }}
                    >
                      Change Staff
                    </Button>
                    <Button
                      onClick={() => {
                        setEdit("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2 font-medium items-center">
                    <Text fontSize="2xl">{enquiry?.staff?.user?.name ?? "Not Selected"} </Text>
                    <div className="text-2xl cursor-pointer">
                      <BiEdit onClick={() => setEdit("STAFF")} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Overview
