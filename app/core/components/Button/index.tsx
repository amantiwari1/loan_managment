import React from "react"
import { Button as BaseButton, ButtonProps, ComponentWithAs } from "@chakra-ui/react"

const theme = {
  primary: "",
}

export const Button: ComponentWithAs<"button", ButtonProps> = ({ ...rest }) => {
  return <BaseButton w="full" size="sm" colorScheme="blue" {...rest} />
}
