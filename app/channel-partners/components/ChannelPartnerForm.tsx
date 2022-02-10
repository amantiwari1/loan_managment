import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ChannelPartnerForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="email" label="Email" type="email" placeholder="Email" />
      <LabeledTextField name="phone" label="Phone" placeholder="Phone" />
      <LabeledTextField name="city" label="City" placeholder="City" />
      <LabeledTextField name="company" label="Company" placeholder="Company" />
    </Form>
  )
}
