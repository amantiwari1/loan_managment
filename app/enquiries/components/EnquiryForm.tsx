import { Divider } from "antd"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SwitchField from "app/core/components/SwitchField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import Select from "react-select"
import { Field } from "react-final-form"
import SelectField from "app/core/components/SelectField"

const client_service_options = [
  { value: "HOME_LOAN", label: "Home Loan" },
  { value: "MORTGAGE_LOAN", label: "Mortgage Loan" },
  { value: "UNSECURED_LOAN", label: "Unsecured Loan" },
  { value: "MSME_LOAN", label: "MSME Loan" },
  { value: "STARTUP_LOAN", label: "Startup Loan" },
  { value: "SUBSIDY_SCHEMES", label: "Subsidy Schemes" },
]
const client_qccupation_type_options = [
  { value: "SALARIED_INDIVIDUAL", label: "Salaried Individual" },
  { value: "INDIVIDUAL", label: "Individual" },
  {
    value: "SELF_EMPLOYED_INDIVIDUAL_OR_PROPRIETORSHIP",
    label: "Self Employed Individual / Proprietorship",
  },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "COMPANY", label: "Company" },
]

export function EnquiryForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="client_name" label="Client Name" placeholder="Enter a Client Name" />
      <LabeledTextField
        type="number"
        name="client_mobile"
        label="Client Mobile"
        placeholder="Enter a Client Mobile"
      />
      <LabeledTextField
        type="email"
        name="client_email"
        label="Client Email"
        placeholder="Enter a Client Email"
      />

      <SelectField
        name="client_service"
        label="Client Service"
        options={client_service_options}
        placeholder="Select Client Service"
      />
      <SelectField
        name="client_qccupation_type"
        label="Client Occupation Type"
        options={client_qccupation_type_options}
        placeholder="Select Client Service"
      />

      <LabeledTextField
        type="number"
        name="loan_amount"
        label="Loan Amount"
        placeholder="Enter a Loan Amount"
      />
      <LabeledTextField name="client_address" label="Address" placeholder="Enter a Address" />
      <Divider />
      <SwitchField name="private_enquiry" label="Private Enquiry" />
    </Form>
  )
}
