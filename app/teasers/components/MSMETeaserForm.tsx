import { Divider, Switch } from "@chakra-ui/react"
import { convertStringToKey } from "app/common"
import { Form, FormProps } from "app/core/components/Form"
import LabeledTextAreaField from "app/core/components/LabeledTextAreaField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useState } from "react"
import { z } from "zod"
import { MSMETeaseData } from "../data"
export { FORM_ERROR } from "app/core/components/Form"
import SelectField from "app/core/components/SelectField"
import SwitchField from "app/core/components/SwitchField"
import MultiUploadFile from "app/core/components/MultiUploadFile"

export function MSMETeaserForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [readOnly, setReadOnly] = useState(true)
  return (
    <div>
      <div className="flex items-center my-2">
        <p className="text-2xl font-bold mr-2">Edit</p>
        <Switch checked={readOnly} onChange={() => setReadOnly(!readOnly)} />
      </div>
      <Form<S> {...props}>
        <MultiUploadFile name="data.teasers" relationName="teaserId" />
        <div className="grid md:grid-cols-2">
          <LabeledTextField readOnly={readOnly} name="data.name" label="Name" placeholder="Name" />
          <LabeledTextField
            readOnly={readOnly}
            name="data.constitution"
            label="Constitution"
            placeholder="Constitution"
          />

          {/* <div className="grid grid-cols-3 col-span-1"> */}
          {/* <div className="col-span-3"> */}
          <LabeledTextField
            readOnly={readOnly}
            name="data.house_no"
            label="House No."
            placeholder="House No."
          />
          {/* </div> */}
          {/* <div className="col-span-3"> */}
          <LabeledTextField
            readOnly={readOnly}
            name="data.street"
            label="Street"
            placeholder="Street"
          />
          {/* </div> */}
          <LabeledTextField
            readOnly={readOnly}
            className="col-span-1"
            name="data.city"
            label="City"
            placeholder="City"
          />
          <LabeledTextField
            readOnly={readOnly}
            className="col-span-1"
            name="data.state"
            label="State"
            placeholder="State"
          />
          <LabeledTextField
            readOnly={readOnly}
            className="col-span-1"
            name="data.pincode"
            label="Pincode"
            placeholder="Pincode"
          />
          {/* </div> */}
          <LabeledTextField
            readOnly={readOnly}
            name="data.Proprietorship"
            label="Proprietorship"
            placeholder="Proprietorship"
          />
          <LabeledTextField
            readOnly={readOnly}
            name="data.nature_of_business"
            label="Nature of Business"
            placeholder="Nature of Business"
          />

          <LabeledTextAreaField
            name="data.Introduction"
            label="Introduction"
            placeholder="Introduction"
          />
          <LabeledTextAreaField
            name="data.about_the_key_persons"
            label="About the Key Persons"
            placeholder="About the Key Persons"
          />
          <LabeledTextField
            readOnly={readOnly}
            name="data.Incorporation"
            label="Incorporation"
            placeholder="Incorporation"
          />
        </div>
        <LabeledTextField
          readOnly={readOnly}
          name="data.financial_summary"
          label="Financial Summary"
          placeholder="Financial Summary"
        />

        {MSMETeaseData.summary.slice(0, 5).map((item) => (
          <div key={convertStringToKey(item?.name)}>
            {item.name}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {MSMETeaseData.year.map((arr, i) => (
                <LabeledTextField
                  readOnly={readOnly}
                  key={convertStringToKey(item?.name + "." + arr?.name)}
                  name={"data." + convertStringToKey(item?.name + "." + arr?.name)}
                  placeholder={arr.name}
                />
              ))}
            </div>
          </div>
        ))}

        <LabeledTextField
          readOnly={readOnly}
          name="data.financial_summary1"
          label="Financial Summary"
          placeholder="Mr./Mrs."
        />

        {MSMETeaseData.summary.slice(5).map((item) => (
          <div key={convertStringToKey(item?.name)}>
            {item.name}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {MSMETeaseData.year.map((arr, i) => (
                <LabeledTextField
                  readOnly={readOnly}
                  key={convertStringToKey(item?.name + "." + arr?.name)}
                  name={"data." + convertStringToKey(item?.name + "." + arr?.name)}
                  // label={arr.name}
                  placeholder={arr.name}
                />
              ))}
            </div>
          </div>
        ))}
        <Divider my={4} />

        <h3 className="text-xl font-bold text-center mt-2">Existing Facilities</h3>
        <SwitchField name="data.is_existing_facilities" label="is Existing Facilities?" />

        <div className="grid md:grid-cols-2">
          {MSMETeaseData.ExistingFacilities.map((arr) => (
            <div key={convertStringToKey("Existing Facilities." + arr.name)}>
              {arr.options ? (
                <SelectField
                  name={"data." + convertStringToKey("Existing Facilities." + arr.name)}
                  label={arr.name}
                  placeholder={arr.name}
                  options={arr.options}
                />
              ) : (
                <LabeledTextField
                  readOnly={readOnly}
                  name={"data." + convertStringToKey("Existing Facilities." + arr.name)}
                  label={arr.name}
                  placeholder={arr.name}
                />
              )}
            </div>
          ))}
        </div>
        <Divider my={4} />

        <h3 className="text-xl font-bold text-center mt-2">Proposed Facilities</h3>
        <div className="grid md:grid-cols-2">
          {MSMETeaseData.ProposedFacilities.map((arr) => (
            <LabeledTextField
              readOnly={readOnly}
              key={convertStringToKey("Proposed Facilities." + arr.name)}
              name={"data." + convertStringToKey("Proposed Facilities." + arr.name)}
              label={arr.name}
              placeholder={arr.name}
            />
          ))}
        </div>
        <Divider my={4} />

        <h3 className="text-xl font-bold text-center mt-2">Security Offered</h3>
        <p className="text-sm text-gray-500 text-center">
          The firm is offering the following security against the credit facility proposed :
        </p>
        <div className="grid grid-cols-2">
          {MSMETeaseData.SecurityOffered.map((arr) => (
            <LabeledTextField
              readOnly={readOnly}
              key={convertStringToKey("Security Offered." + arr.name)}
              name={"data." + convertStringToKey("Security Offered." + arr.name)}
              label={arr.name}
              placeholder={arr.name}
            />
          ))}
        </div>
        <Divider my={4} />
        <h3 className="text-xl font-bold text-center mt-2">Guarantee</h3>
        <p className="text-sm text-gray-500 text-center">
          Personal Guarantee of the following persons:
        </p>
        <div className="grid md:grid-cols-2">
          {MSMETeaseData.Guarantee.map((arr) => (
            <LabeledTextField
              readOnly={readOnly}
              key={convertStringToKey("Guarantee." + arr.name)}
              name={"data." + convertStringToKey("Guarantee." + arr.name)}
              label={arr.name}
              placeholder={arr.name}
            />
          ))}
        </div>
      </Form>
    </div>
  )
}
