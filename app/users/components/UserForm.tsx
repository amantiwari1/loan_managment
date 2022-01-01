import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import Select from "react-select"
import { Field } from "react-final-form"

const options = [
  { value: "USER", label: "Customer" },
  { value: "PARTNER", label: "Partner" },
  { value: "STAFF", label: "Staff" },
  { value: "ADMIN", label: "Admin" },
]

export function UserForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="email" label="Email" placeholder="Email" />
      <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
      <SelectField name="role" label="Role" options={options} placeholder="Select a Role" />
    </Form>
  )
}
