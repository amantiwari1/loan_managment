import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

import { Input } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Checkbox } from "@chakra-ui/react"

export interface CheckboxLabeledTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  children: React.ReactNode

  color?: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const CheckboxLabeledTextField = forwardRef<HTMLInputElement, CheckboxLabeledTextFieldProps>(
  ({ name, children, color, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name)

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <Checkbox colorScheme="customgreen" {...input} disabled={submitting} {...props}>
          <span className={`${color ? color : "text-gray-700"}`}>{children}</span>
        </Checkbox>

        <div role="alert" className="text-red-500 min-h-[20px]">
          {touched && normalizedError && <>{normalizedError}</>}
        </div>
      </div>
    )
  }
)

export default CheckboxLabeledTextField
