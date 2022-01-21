import { Text } from "@chakra-ui/react"
import { Button } from "app/core/components/Button"
import getUsers from "app/users/queries/getUsers"
import { useMutation, useQuery, useSession } from "blitz"
import React, { useState } from "react"
import { BiEdit } from "react-icons/bi"
import Select from "react-select"
import addCustomerEnquiry from "../mutations/addCustomerEnquiry"

const CustomerSelect = ({ enquiry }) => {
  const session = useSession()

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
  const [Edit, setEdit] = useState(false)

  const [addCustomerMutation, { isLoading: customerLoading }] = useMutation(addCustomerEnquiry)

  const [Customer, setCustomer] = useState<number | undefined>(undefined)

  return (
    <div>
      <Text fontSize="sm">Primary Applicant :</Text>
      {Edit ? (
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
              setEdit(false)
            }}
          >
            Change customer
          </Button>
          <Button
            onClick={() => {
              setEdit(false)
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2 font-medium items-center">
          <Text fontSize="2xl">{enquiry?.customer?.user?.name ?? "Not Selected"} </Text>
          <div className="text-2xl cursor-pointer">
            <BiEdit onClick={() => setEdit(true)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerSelect
