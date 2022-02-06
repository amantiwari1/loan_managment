import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import SelectField from "app/core/components/SelectField"
import UploadFile from "app/core/components/UploadFile"
import { useSession } from "blitz"

import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function DocumentForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const session = useSession()
  return (
    <Form<S> {...props}>
      <LabeledTextField
        disabled={["USER", "PARTNER"].includes(session.role)}
        name="document_name"
        label="Document Name"
        placeholder="Enter"
      />
      <UploadFile />
      {/* <SelectField
        name="status"
        label="status"
        options={options}
        placeholder="Select Client Service"
      /> */}
    </Form>
  )
}
