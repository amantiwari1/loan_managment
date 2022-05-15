import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
} from "@chakra-ui/react"
import React from "react"
import { Button } from "./Button"

export const ActionComponent = ({ onEdit, onDelete, isDeleting, session }) => {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)

  const onAlertClose = () => setIsAlertOpen(false)

  const firstField = React.useRef(null)
  return (
    <div className="flex space-x-4">
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={firstField} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Document
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button size="xs" ref={firstField} variant="outline" onClick={onAlertClose}>
                Cancel
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                isLoading={isDeleting}
                onClick={async () => {
                  await onDelete()
                  onAlertClose()
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <IconButton
        aria-label="Edit"
        onClick={onEdit}
        variant="outline"
        icon={<EditIcon />}
        size="xs"
      />
      {["ADMIN", "STAFF"].includes(session.role) && (
        <IconButton
          aria-label="Delete"
          size="xs"
          onClick={() => {
            setIsAlertOpen(true)
          }}
          colorScheme="red"
          icon={<DeleteIcon />}
        />
      )}
    </div>
  )
}
