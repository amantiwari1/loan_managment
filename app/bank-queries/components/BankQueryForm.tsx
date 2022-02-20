import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import { list_of_bank_options } from "app/core/data/bank"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function BankQueryForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <SelectField
        name="bank_query"
        label="Bank Name"
        placeholder="Name"
        options={list_of_bank_options}
      />
      <LabeledTextField name="our_response" label="Our Response" placeholder="Name" />
      <LabeledTextField name="remark" label="remark" placeholder="Remark" />
    </Form>
  )
}
