import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import SwitchField from "app/core/components/SwitchField"
import { list_of_bank_options } from "app/core/data/bank"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function CaseStatusForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <SelectField
        name="bank_code"
        label="Bank Name"
        placeholder="Name"
        options={list_of_bank_options}
      />
      <LabeledTextField name="remark" label="Remark" placeholder="Name" />
      <SwitchField name="final_login" label="Final Login" />
    </Form>
  )
}
