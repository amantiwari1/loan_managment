import { DeleteIcon } from "@chakra-ui/icons"
import {
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Drawer,
  useDisclosure,
  Text,
  Divider,
} from "@chakra-ui/react"
import { Button } from "app/core/components/Button"
import getUsers from "app/users/queries/getUsers"
import { useMutation, useQuery, useSession } from "blitz"
import React, { useEffect, useState } from "react"
import { BiEdit, BiUser } from "react-icons/bi"
import Select from "react-select"
import addStaffEnquiry from "../mutations/addStaffEnquiry"
import { EnquireUserInterface, EnquiryUser } from "app/type"
import { TransformationData } from "app/common"

const StaffDraw = ({
  StaffEnquiry,
  enquiry,
  refetch,
}: {
  enquiry: EnquiryUser
  StaffEnquiry: EnquireUserInterface[]
  refetch: any
}) => {
  const session = useSession()
  const [addStaffEnquiryMutation, { isLoading }] = useMutation(addStaffEnquiry)

  const [FetchStaff] = useQuery(
    getUsers,
    {
      where: {
        role: "STAFF",
      },
    },
    {
      enabled: !["USER", "PARTNER", "STAFF"].includes(session.role as string),
    }
  )

  const [Staff, setStaff] = useState<EnquireUserInterface[]>([])

  const [Options, setOptions] = useState([])

  const [select, setSelected] = useState<EnquireUserInterface>()

  useEffect(() => {
    setOptions(TransformationData(FetchStaff, StaffEnquiry))
    setStaff(StaffEnquiry ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StaffEnquiry])

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setStaff(StaffEnquiry ?? [])
    },
  })

  return (
    <div>
      <div>
        <Drawer
          isOpen={isOpen}
          size="lg"
          placement="right"
          initialFocusRef={firstField}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Edit Staff</DrawerHeader>

            <DrawerBody>
              <div className="flex space-x-2 max-w-xl mb-4">
                <div className="w-[40rem]">
                  <Select
                    onChange={(data) => {
                      setStaff((prevArr) => [...prevArr, data])
                      setOptions((prevArr) => prevArr.filter((arr) => arr.value !== data.value))
                      setSelected(null)
                    }}
                    value={select}
                    options={Options}
                  />
                </div>
              </div>

              {!Staff.length && <Text fontWeight="medium">No Staff Selected</Text>}
              {Staff?.map((arr, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center my-2">
                    <div>
                      <div className="bg-blue-200 text-blue-500 text-xl p-2 rounded-full">
                        <BiUser />
                      </div>
                    </div>
                    <div>
                      <Text fontWeight="medium">{arr.label}</Text>
                    </div>

                    <Button
                      w={24}
                      onClick={() => {
                        setStaff((prevArr) => prevArr.filter((i) => i.value !== arr.value))
                        setOptions(
                          TransformationData(
                            FetchStaff,
                            Staff.filter((i) => i.value !== arr.value)
                          )
                        )
                      }}
                      colorScheme="red"
                      leftIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </div>
                  <Divider my={4} />
                </div>
              ))}

              <Button
                className="mt-10"
                isLoading={isLoading}
                onClick={async () => {
                  await addStaffEnquiryMutation({
                    id: enquiry.id,
                    userId: Staff?.map((arr) => arr.value),
                  })
                  await refetch()

                  onClose()
                }}
              >
                Update Staff
              </Button>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <div className="flex items-center space-x-2">
          <Text fontSize="sm">Staff :</Text>
          {!["STAFF", "USER", "PARTNER"].includes(session.role) && (
            <div className="text-2xl cursor-pointer">
              <BiEdit onClick={onOpen} />
            </div>
          )}
        </div>
        <div className="space-y-2 font-medium items-center">
          {!enquiry?.staff.length && <Text fontWeight="medium">No Staff Selected</Text>}
          {enquiry?.staff.map((arr, i) => (
            <div key={i} className="flex space-x-2 items-center">
              <div>
                <div className="bg-blue-200 text-blue-500 text-xl p-2 rounded-full">
                  <BiUser />
                </div>
              </div>
              <div>
                <Text fontWeight="medium">{arr.user.name}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaffDraw
