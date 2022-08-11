import { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import { validateZodSchema } from "blitz"
import { Button } from "./Button"
export { FORM_ERROR } from "final-form"
import arrayMutators from "final-form-arrays"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  buttonColor?: "green" | "blue"
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  buttonColor,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      mutators={{
        ...arrayMutators,
      }}
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError, errors }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          <div className="my-2">
            {submitText && (
              <Button
                colorScheme={buttonColor === "green" ? "Customgreen" : "Customblue"}
                className="w-full"
                isLoading={submitting}
                type="submit"
                loadingText="Submitting"
              >
                {submitText}
              </Button>
            )}
          </div>
        </form>
      )}
    />
  )
}

export default Form
