import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import UploadFile from "app/core/components/UploadFile"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ProjectReportForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="label" label="Label" placeholder="Name" />
      <UploadFile />

      <LabeledTextField name="remark" label="Remark" placeholder="Name" />
    </Form>
  )
}
