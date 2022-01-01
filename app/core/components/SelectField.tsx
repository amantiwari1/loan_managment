import React, { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef, useEffect } from "react"
import { Field, useField, UseFieldConfig } from "react-final-form"
import Select, { GroupBase, OptionsOrGroups } from "react-select"

export interface SelectFieldProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field label. */
  placeholder: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  options: OptionsOrGroups<any, GroupBase<any>>
}

export const SelectField = ({ options, placeholder, label, ...rest }: SelectFieldProps) => {
  return (
    <div className="mb-5">
      <label className="font-medium">{label}</label>
      <div className="mt-1">
        <Field {...rest} defaultValue={options[0].value}>
          {(props) => (
            <div>
              <Select
                // label="Client Occupation Type"
                placeholder={placeholder}
                name={props.input.name}
                value={props.input.value?.value}
                onChange={(value) => props.input.onChange(value?.value)}
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
