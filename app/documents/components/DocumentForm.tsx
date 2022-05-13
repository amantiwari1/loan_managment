import { Form, FormProps } from "app/core/components/Form"
import LabeledTextAreaField from "app/core/components/LabeledTextAreaField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import MultiUploadFile from "app/core/components/MultiUploadFile"
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
      <LabeledTextAreaField
        disabled={["USER", "PARTNER"].includes(session.role)}
        name="description"
        label="Description"
        placeholder="Enter"
      />
      <LabeledTextField
        disabled={["USER", "PARTNER"].includes(session.role)}
        name="remark"
        label="Remark"
        placeholder="Enter"
      />
    </Form>
  )
}
