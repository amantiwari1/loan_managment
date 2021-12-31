import React from "react"
import { Button as BaseButton } from "antd"
import { ButtonProps } from "antd/lib/button"

export type IButton = ButtonProps

const button =
  "bg-blue-400 w-full rounded-md focus:bg-blue-400 h-10 focus:ring-2 focus:ring-blue-500/50 focus:text-white hover:bg-blue-500 text-white hover:text-white border-0"

const theme = {
  primary: "",
}

export const Button: React.FC<IButton> = ({ ...rest }) => {
  return <BaseButton className={button + " " + theme.primary} {...rest} />
}
