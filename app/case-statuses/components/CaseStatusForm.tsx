import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import SwitchField from "app/core/components/SwitchField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

const options = [
  {
    value: "UPLOADED",
    label: "Uploaded",
  },
  {
    value: "NOT_UPLOAD",
    label: "No Upload",
  },
]
export function CaseStatusForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="bank_name" label="Bank Name" placeholder="Name" />
      <LabeledTextField name="final_login" label="Final Login" placeholder="Name" />
      <SelectField
        name="status"
        label="status"
        options={options}
        placeholder="Select Client Service"
      />
      <LabeledTextField name="remark" label="Remark" placeholder="Name" />
      <SwitchField name="response_from_bank" label="Response from bank" />
    </Form>
  )
}
