import React from "react"
import { Field, useField, UseFieldConfig } from "react-final-form"
import DayPickerInput from "react-day-picker/DayPickerInput"
import { Input } from "@chakra-ui/react"

export interface SelectFieldProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field label. */
  placeholder: string
}

export const DatePicker = ({ placeholder, label, ...rest }: SelectFieldProps) => {
  return (
    <div className="mb-5">
      <label className="font-medium">{label}</label>
      <div className="mt-1">
        <Field {...rest}>
          {(props) => (
            <div>
              <DayPickerInput
                component={(props) => <Input {...props} w="full" />}
                value={props.input.value}
                onDayChange={(e) => {
                  console.log(e)
                  props.input.onChange(e)
                }}
              />
            </div>
          )}
        </Field>
      </div>
    </div>
  )
}

export default DatePicker
