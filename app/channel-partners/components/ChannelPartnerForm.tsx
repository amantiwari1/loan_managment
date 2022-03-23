import { Form, FormProps } from "app/core/components/Form"
import LabeledPhoneField from "app/core/components/LabeledPhoneField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ChannelPartnerForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="email" label="Email" type="email" placeholder="Email" />

      <LabeledPhoneField type="number" name="phone" label="Phone" placeholder="Enter a Phone" />

      <LabeledTextField name="city" label="City" placeholder="City" />
      <LabeledTextField name="company" label="Company" placeholder="Company" />
    </Form>
  )
}
