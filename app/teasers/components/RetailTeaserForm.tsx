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
import { FieldArray } from "react-final-form-arrays"
import MultiUploadFile from "app/core/components/MultiUploadFile"

export function RetailTeaserForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [readOnly, setReadOnly] = useState(true)
  return (
    <div>
      <div className="flex items-center my-2">
        <p className="text-2xl font-bold mr-2">Edit</p>
        <Switch checked={readOnly} onChange={() => setReadOnly(!readOnly)} />
      </div>
      <Form<S> {...props}>
        <MultiUploadFile name="teasers" relationName="teaserId" />
        <FieldArray name={`data.teasers`}>
          {({ fields }) => (
            <div>
              {fields.map((name, index) => (
                <div key={name}>
                  <p className="text-2xl pt-5 pb-2 font-bold text-center">
                    {index ? `CO-APPLICANT ${index} DETAILS:` : "APPLICANT DETAILS:"}
                  </p>
                  <div className="grid md:grid-cols-2">
                    <LabeledTextField
                      readOnly={readOnly}
                      name={`${name}.name`}
                      label="Name"
                      placeholder="Name"
                    />
                    <LabeledTextField
                      readOnly={readOnly}
                      name={`${name}.occupation`}
                      label="Occupation"
                      placeholder="Occupation"
                    />

                    <LabeledTextField
                      readOnly={readOnly}
                      name={`${name}.house_no`}
                      label="House No."
                      placeholder="House No."
                    />
                    <LabeledTextField
                      readOnly={readOnly}
                      name={`${name}.street`}
                      label="Street"
                      placeholder="Street"
                    />
                    <LabeledTextField
                      readOnly={readOnly}
                      className="col-span-1"
                      name={`${name}.city`}
                      label="City"
                      placeholder="City"
                    />
                    <LabeledTextField
                      readOnly={readOnly}
                      className="col-span-1"
                      name={`${name}.state`}
                      label="State"
                      placeholder="State"
                    />
                    <LabeledTextField
                      readOnly={readOnly}
                      className="col-span-1"
                      name={`${name}.pincode`}
                      label="Pincode"
                      placeholder="Pincode"
                    />

                    <LabeledTextAreaField
                      name={`${name}.about_the_key_persons`}
                      label="About the Key Persons"
                      placeholder="About the Key Persons"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-center mt-2">If Business</h3>
                  <div className="grid md:grid-cols-2">
                    {MSMETeaseData.AboutOccupationBusiness.map((arr) => (
                      <LabeledTextField
                        readOnly={readOnly}
                        key={convertStringToKey(name + ".About Occupation Business." + arr.name)}
                        name={convertStringToKey(name + ".About Occupation Business." + arr.name)}
                        label={arr.name}
                        placeholder={arr.name}
                      />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-center mt-2">If Service</h3>
                  <div className="grid md:grid-cols-2">
                    {MSMETeaseData.AboutOccupationService.map((arr) => (
                      <LabeledTextField
                        readOnly={readOnly}
                        key={convertStringToKey(name + ".About Occupation Service." + arr.name)}
                        name={convertStringToKey(name + ".About Occupation Service." + arr.name)}
                        label={arr.name}
                        placeholder={arr.name}
                      />
                    ))}
                  </div>

                  <LabeledTextField
                    readOnly={readOnly}
                    name={`${name}.financial_summary`}
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
                            key={convertStringToKey(`${name}.${item.name}.${arr.name}`)}
                            name={convertStringToKey(`${name}.${item.name}.${arr.name}`)}
                            // label={arr.name}
                            placeholder={arr.name}
                          />
                        ))}
                      </div>
                    </>
                  ))}

                  <LabeledTextField
                    readOnly={readOnly}
                    name={`${name}.financial_summary1`}
                    label="Financial Summary"
                    placeholder="Mr./Mrs."
                  />

                  {MSMETeaseData.summary.slice(5).map((item) => (
                    <div key={convertStringToKey(`${name}.${item.name}`)}>
                      {item.name}
                      <div className="grid grid-cols-2 md:grid-cols-4">
                        {MSMETeaseData.year.map((arr, i) => (
                          <LabeledTextField
                            key={convertStringToKey(`${name}.${item.name}.${arr.name}`)}
                            readOnly={readOnly}
                            name={convertStringToKey(`${name}.${item.name}.${arr.name}`)}
                            // label={arr.name}
                            placeholder={arr.name}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <Divider my={4} />

                  <h3 className="text-xl font-bold text-center mt-2">Existing Facilities</h3>
                  <div className="grid md:grid-cols-2">
                    {MSMETeaseData.ExistingFacilities.map((arr) => (
                      <>
                        {arr.options ? (
                          <div
                            key={convertStringToKey(name + ".Existing Facilities." + arr.name)}
                            className="pr-2 pt-1"
                          >
                            <SelectField
                              name={convertStringToKey(name + ".Existing Facilities." + arr.name)}
                              label={arr.name}
                              placeholder={arr.name}
                              options={arr.options}
                            />
                          </div>
                        ) : (
                          <LabeledTextField
                            readOnly={readOnly}
                            key={convertStringToKey(name + ".Existing Facilities." + arr.name)}
                            name={convertStringToKey(name + ".Existing Facilities." + arr.name)}
                            label={arr.name}
                            placeholder={arr.name}
                          />
                        )}
                      </>
                    ))}
                  </div>
                  <Button w={200} type="button" onClick={() => fields.remove(index)}>
                    Remove Applicant
                  </Button>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  w={200}
                  onClick={() => fields.push({ firstName: "", lastName: "" })}
                >
                  Add Applicant
                </Button>
              </div>
            </div>
          )}
        </FieldArray>
      </Form>
    </div>
  )
}
