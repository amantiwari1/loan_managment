import { Divider } from "@chakra-ui/react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SwitchField from "app/core/components/SwitchField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import SelectField from "app/core/components/SelectField"
import { client_service_options_data } from "app/common"
import LabeledPhoneField from "app/core/components/LabeledPhoneField"
import LabeledCurrencyTextField from "app/core/components/LabeledCurrencyTextField"
import LabeledTextAreaField from "app/core/components/LabeledTextAreaField"
import CheckboxLabeledTextField from "app/core/components/CheckboxLabeledTextField"

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

export function EnquiryPublicForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <SelectField
        color="text-white"
        name="client_service"
        label="Client Service"
        options={client_service_options_data}
        placeholder="Select Client Service"
      />

      <div className="md:flex justify-between items-center">
        <LabeledTextField
          color="text-white"
          name="client_name"
          label="Client Name"
          placeholder="Enter a Client Name"
        />

        <div className="w-80 ">
          <SelectField
            color="text-white"
            name="client_qccupation_type"
            label="Client Occupation Type"
            options={client_qccupation_type_options}
            placeholder="Select Client Service"
          />
        </div>
      </div>

      <div className="md:flex justify-between">
        <LabeledTextField
          color="text-white"
          type="email"
          name="client_email"
          label="Client Email"
          placeholder="Enter a Client Email"
        />

        <div className="w-80">
          <LabeledCurrencyTextField
            color="text-white"
            type="number"
            name="loan_amount"
            label="Loan Amount"
            placeholder="Enter a Loan Amount"
          />
        </div>
      </div>

      <div className="my-1">
        <LabeledPhoneField
          buttonColor="green"
          color="text-white"
          type="number"
          name="client_mobile"
          label="Client Mobile"
          placeholder="Enter a Client Mobile"
        />
      </div>

      <LabeledTextAreaField
        color="text-white"
        name="client_address"
        label="Address"
        placeholder="Enter a Address"
      />

      <CheckboxLabeledTextField color="text-white" name="is_agree" placeholder="">
        <div className="py-1">
          <label className="text-lg  text-white">
            I accept the{" "}
            <a className="text-[#3446d5]" href="https://kredpartner.com/terms-of-use">
              terms of use
            </a>{" "}
            &amp;{" "}
            <a className="text-[#3446d5]" href="https://kredpartner.com/privacy-policy">
              privacy policy{" "}
            </a>
          </label>
        </div>
      </CheckboxLabeledTextField>
    </Form>
  )
}
