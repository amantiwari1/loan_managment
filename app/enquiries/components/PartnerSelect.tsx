import { Text } from "@chakra-ui/react"
import { Button } from "app/core/components/Button"
import getUsers from "app/users/queries/getUsers"
import { useMutation, useQuery, useSession } from "blitz"
import React, { useState } from "react"
import { BiEdit } from "react-icons/bi"
import addPartnerEnquiry from "../mutations/addPartnerEnquiry"
import Select from "react-select"

const PartnerSelect = ({ enquiry }) => {
  const session = useSession()

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
  const [Edit, setEdit] = useState(false)

  const [addPartnerMutation, { isLoading: partnerLoading }] = useMutation(addPartnerEnquiry)
  const [Partner, setPartner] = useState<number | undefined>(undefined)

  return (
    <div>
      <div>
        <Text fontSize="sm">Partner :</Text>
        {Edit ? (
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
                setEdit(false)
              }}
            >
              Change Partner
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
            <Text fontSize="2xl">{enquiry?.partner?.user?.name ?? "Not Selected"} </Text>
            <div className="text-2xl cursor-pointer">
              <BiEdit onClick={() => setEdit(true)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerSelect
