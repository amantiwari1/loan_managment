import React, { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef, useEffect } from "react"
import { Field, useField, UseFieldConfig } from "react-final-form"
import Select, { GroupBase, OptionsOrGroups } from "react-select"
import WindowedSelect from "./react-windowed-select"

export interface SelectFieldProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field label. */
  placeholder: string

  isDefault?: boolean
  /** Field type. Doesn't include radio buttons and checkboxes */
  options: OptionsOrGroups<any, GroupBase<any>>
}

export const SelectField = ({
  options,
  isDefault,
  placeholder,
  label,
  ...rest
}: SelectFieldProps) => {
  const isDefaultData = {}

  if (isDefault) {
    isDefaultData["defaultValue"] = options[0]
  }
  return (
    <div className="mb-5">
      <label className="font-medium">{label}</label>
      <div className="mt-1">
        <Field {...rest}>
          {(props) => (
            <div>
              <WindowedSelect
                placeholder={placeholder}
                name={props.input.name}
                value={{
                  value: props.input.value,
                  label: options.find((arr) => arr.value === props.input.value)?.label,
                }}
                onChange={(value: any) => props.input.onChange(value?.value)}
                options={options}
              />
            </div>
          )}
        </Field>
      </div>
    </div>
  )
}

export default SelectField
