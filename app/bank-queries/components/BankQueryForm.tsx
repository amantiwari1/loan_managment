import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
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
export function BankQueryForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="bank_query" label="Bank Query" placeholder="Name" />
      <LabeledTextField name="our_response" label="Our Response" placeholder="Name" />
      <LabeledTextField name="remark" label="remark" placeholder="Remark" />
    </Form>
  )
}
