import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { Switch } from "@chakra-ui/react"
import { FormControl, FormLabel } from "@chakra-ui/form-control"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<typeof Switch> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      defaultValue: false,
      // initialValue: false,
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <FormLabel {...labelProps}>
          <div className="space-x-3">
            <span>{label}</span>
            <Switch
              {...input}
              value={input.value ?? false}
              defaultValue={input.value ?? false}
              defaultChecked={input.value ?? false}
              disabled={submitting}
              {...props}
              ref={ref}
            />
          </div>
        </FormLabel>

        <div role="alert" className="text-red-500 min-h-[20px]">
          {touched && normalizedError && <>{normalizedError}</>}
        </div>
      </div>
    )
  }
)

export default LabeledTextField
