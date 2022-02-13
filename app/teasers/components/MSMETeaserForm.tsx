import { Divider, Switch } from "@chakra-ui/react"
import { convertStringToKey } from "app/common"
import { Button } from "app/core/components/Button"
import { Form, FormProps } from "app/core/components/Form"
import LabeledTextAreaField from "app/core/components/LabeledTextAreaField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useState } from "react"
import { z } from "zod"
import { MSMETeaseData } from "../data"
export { FORM_ERROR } from "app/core/components/Form"
import SelectField from "app/core/components/SelectField"

export function MSMETeaserForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [readOnly, setReadOnly] = useState(true)
  return (
    <div>
      <div className="flex items-center my-2">
        <p className="text-2xl font-bold mr-2">Edit</p>
        <Switch checked={readOnly} onChange={() => setReadOnly(!readOnly)} />
      </div>
      <Form<S> {...props}>
        <div className="grid md:grid-cols-2">
          <LabeledTextField readOnly={readOnly} name="name" label="Name" placeholder="Name" />
          <LabeledTextField
            readOnly={readOnly}
            name="constitution"
            label="Constitution"
            placeholder="Constitution"
          />

          {/* <div className="grid grid-cols-3 col-span-1"> */}
          {/* <div className="col-span-3"> */}
          <LabeledTextField
            readOnly={readOnly}
            name="house_no"
            label="House No."
            placeholder="House No."
          />
          {/* </div> */}
          {/* <div className="col-span-3"> */}
          <LabeledTextField readOnly={readOnly} name="street" label="Street" placeholder="Street" />
          {/* </div> */}
          <LabeledTextField
            readOnly={readOnly}
            className="col-span-1"
            name="city"
            label="City"
            placeholder="City"
          />
          <LabeledTextField
            readOnly={readOnly}
            className="col-span-1"
            name="state"
            label="State"
            placeholder="State"
          />
          <LabeledTextField
            readOnly={readOnly}
            className="col-span-1"
            name="pincode"
            label="Pincode"
            placeholder="Pincode"
          />
          {/* </div> */}
          <LabeledTextField
            readOnly={readOnly}
            name="Proprietorship"
            label="Proprietorship"
            placeholder="Proprietorship"
          />
          <LabeledTextField
            readOnly={readOnly}
            name="nature_of_business"
            label="Nature of Business"
            placeholder="Nature of Business"
          />

          <LabeledTextAreaField
            name="Introduction"
            label="Introduction"
            placeholder="Introduction"
          />
          <LabeledTextAreaField
            name="about_the_key_persons"
            label="About the Key Persons"
            placeholder="About the Key Persons"
          />
          <LabeledTextField
            readOnly={readOnly}
            name="Incorporation"
            label="Incorporation"
            placeholder="Incorporation"
          />
        </div>
        <LabeledTextField
          readOnly={readOnly}
          name="financial_summary"
          label="Financial Summary"
          placeholder="Financial Summary"
        />

        {MSMETeaseData.summary.slice(0, 5).map((item) => (
          <>
            {item.name}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {MSMETeaseData.year.map((arr, i) => (
                <LabeledTextField
                  readOnly={readOnly}
                  key={item.key + "." + arr.key}
                  name={item.key + "." + arr.key}
                  // label={arr.name}
                  placeholder={arr.name}
                />
              ))}
            </div>
          </>
        ))}

        <LabeledTextField
          readOnly={readOnly}
          name="financial_summary1"
          label="Financial Summary"
          placeholder="Mr./Mrs."
        />

        {MSMETeaseData.summary.slice(5).map((item) => (
          <>
            {item.name}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {MSMETeaseData.year.map((arr, i) => (
                <LabeledTextField
                  readOnly={readOnly}
                  key={item.key + "." + arr.key}
                  name={item.key + "." + arr.key}
                  // label={arr.name}
                  placeholder={arr.name}
                />
              ))}
            </div>
          </>
        ))}
        <Divider />

        <h3 className="text-xl font-bold text-center mt-2">Existing Facilities</h3>
        <div className="grid md:grid-cols-2">
          {MSMETeaseData.ExistingFacilities.map((arr) => (
            <>
              {arr.options ? (
                <SelectField
                  key={convertStringToKey("Existing Facilities." + arr.key)}
                  name={convertStringToKey("Existing Facilities." + arr.key)}
                  label={arr.name}
                  placeholder={arr.name}
                  options={arr.options}
                />
              ) : (
                <LabeledTextField
                  readOnly={readOnly}
                  key={convertStringToKey("Existing Facilities." + arr.key)}
                  name={convertStringToKey("Existing Facilities." + arr.key)}
                  label={arr.name}
                  placeholder={arr.name}
                />
              )}
            </>
          ))}
        </div>
        <Divider />

        <h3 className="text-xl font-bold text-center mt-2">Proposed Facilities</h3>
        <div className="grid md:grid-cols-2">
          {MSMETeaseData.ProposedFacilities.map((arr) => (
            <LabeledTextField
              readOnly={readOnly}
              key={convertStringToKey("Proposed Facilities." + arr.name)}
              name={convertStringToKey("Proposed Facilities." + arr.name)}
              label={arr.name}
              placeholder={arr.name}
            />
          ))}
        </div>
        <Divider />

        <h3 className="text-xl font-bold text-center mt-2">Security Offered</h3>
        <p className="text-sm text-gray-500 text-center">
          The firm is offering the following security against the credit facility proposed :
        </p>
        <div className="grid grid-cols-2">
          {MSMETeaseData.SecurityOffered.map((arr) => (
            <LabeledTextField
              readOnly={readOnly}
              key={convertStringToKey("Security Offered." + arr.name)}
              name={convertStringToKey("Security Offered." + arr.name)}
              label={arr.name}
              placeholder={arr.name}
            />
          ))}
        </div>
        <Divider />
        <h3 className="text-xl font-bold text-center mt-2">Guarantee</h3>
        <p className="text-sm text-gray-500 text-center">
          Personal Guarantee of the following persons:
        </p>
        <div className="grid md:grid-cols-2">
          {MSMETeaseData.Guarantee.map((arr) => (
            <LabeledTextField
              readOnly={readOnly}
              key={convertStringToKey("Guarantee." + arr.name)}
              name={convertStringToKey("Guarantee." + arr.name)}
              label={arr.name}
              placeholder={arr.name}
            />
          ))}
        </div>
      </Form>
    </div>
  )
}
