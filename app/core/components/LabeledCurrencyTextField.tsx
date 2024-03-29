import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

import { Input } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import NumberFormat from "react-number-format"

export interface LabeledCurrencyTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
  color?: string
}

export const LabeledCurrencyTextField = forwardRef<HTMLInputElement, LabeledCurrencyTextFieldProps>(
  ({ name, label, color, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <FormLabel {...labelProps}>
          <span className={`${color ? color : "text-gray-700"}`}>{label}</span>

          <NumberFormat
            thousandsGroupStyle="lakh"
            prefix="₹"
            inputMode="numeric"
            customInput={Input}
            onValueChange={(values) => {
              input.onChange(values.value)
            }}
            thousandSeparator={true}
            disabled={submitting}
            bg="white"
            className="w-full mt-1 py-3 px-2  border-2 border-blue-300 bg-white  rounded-md focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          />

          <Input
            hidden
            bg="white"
            {...input}
            disabled={submitting}
            {...props}
            className="w-full mt-1 py-3 px-2  border-2 border-blue-300 bg-white  rounded-md focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
            ref={ref}
          />
        </FormLabel>

        <div role="alert" className="text-red-500 min-h-[20px]">
          {touched && normalizedError && <>{normalizedError}</>}
        </div>
      </div>
    )
  }
)

export default LabeledCurrencyTextField
