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
} from "@chakra-ui/react"
import { Button } from "app/core/components/Button"
import getUsers from "app/users/queries/getUsers"
import { useQuery, useSession } from "blitz"
import React, { useState } from "react"
import { BiEdit } from "react-icons/bi"
import Select from "react-select"

const StaffDraw = ({ enquiry }) => {
  const session = useSession()

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

  const [Edit, setEdit] = useState(false)
  const [Staff, setStaff] = useState<number[]>([])

  const firstField = React.useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {},
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
            <DrawerHeader borderBottomWidth="1px">Add New Document</DrawerHeader>

            <DrawerBody>
              <div className="flex space-x-2 max-w-xl mb-4">
                <div className="w-[40rem]">
                  <Select
                    onChange={(data) => {
                      setStaff((prevArr) => [...prevArr, data?.value])
                    }}
                    defaultValue={{
                      value: enquiry?.customer?.user?.id,
                      label: enquiry?.customer?.user?.name,
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
                  onClick={async () => {
                    setEdit(false)
                  }}
                >
                  Add Staff
                </Button>
              </div>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Text fontSize="sm">Staff :</Text>
        <div className="text-2xl cursor-pointer">
          <BiEdit onClick={onOpen} />
        </div>
        <div className="flex space-x-2 font-medium items-center">
          {enquiry?.staff?.map((arr) => (
            <Text fontSize="2xl" key={arr.name}>
              {arr.name}
            </Text>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaffDraw
