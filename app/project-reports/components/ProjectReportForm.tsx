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

export function ProjectReportForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="label" label="Label" placeholder="Name" />
      <SelectField name="status" label="status" options={options} placeholder="Select" />
      <LabeledTextField name="remark" label="Remark" placeholder="Name" />
    </Form>
  )
}
