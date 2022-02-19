import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react"
import React from "react"
import { Button } from "app/core/components/Button"

const DrawerForm = ({ isOpen, firstField, onClose, title, children }) => {
  return (
    <Drawer
      isOpen={isOpen}
      size="md"
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerForm
