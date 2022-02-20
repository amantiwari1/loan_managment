import { client_service_options_data } from "app/common"
import DatePicker from "app/core/components/DatePicker"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function SanctionDisbursmentForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="client_name" label="Client Name" placeholder="Client Name" />
      <LabeledTextField name="bank_name" label="Bank Name" placeholder="Bank Name" />
      <LabeledTextField name="tenure" label="Tenure" placeholder="Tenure" />
      <LabeledTextField
        type="number"
        name="amount_sanctioned"
        label="Amount Sanctioned"
        placeholder="Enter a Amount Sanctioned"
      />
      <SelectField
        name="product"
        label="Client Service"
        options={client_service_options_data}
        placeholder="Select Client Service"
      />
      <DatePicker
        name="date_of_sanction"
        label="Date of Sanction"
        placeholder="Enter a Date of Sanction"
      />
      <LabeledTextField
        type="number"
        name="rate_of_interest"
        label="Rate of Interest"
        placeholder="Enter a Rate of Interest"
      />
      <LabeledTextField name="remark" label="Remark" placeholder="Remark" />
    </Form>
  )
}
