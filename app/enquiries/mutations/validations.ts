import { z } from "zod"
const isValidPhoneNumber = (phonenumber: number) => `${phonenumber}`.length > 9

const client_name = z.string()
const client_mobile = z
  .custom(isValidPhoneNumber, { message: "Not a valid phone number" })
  .transform(parseInt)

const client_email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

const client_service = z.enum([
  "HOME_LOAN",
  "MORTGAGE_LOAN",
  "UNSECURED_LOAN",
  "MSME_LOAN",
  "STARTUP_LOAN",
  "SUBSIDY_SCHEMES",
])
const client_qccupation_type = z.enum([
  "SALARIED_INDIVIDUAL",
  "INDIVIDUAL",
  "SELF_EMPLOYED_INDIVIDUAL_OR_PROPRIETORSHIP",
  "PARTNERSHIP",
  "COMPANY",
])
const loan_amount = z.number()
const client_address = z.string()
const private_enquiry = z.boolean()

export const EnquiryValidation = z.object({
  client_name,
  client_mobile,
  client_email,
  client_service,
  client_qccupation_type,
  loan_amount,
  client_address,
  private_enquiry,
})
export const ChannelPartnerValidation = z.object({
  name: client_name,
  phone: client_mobile,
  email: client_email,
  company: z.string(),
  city: z.string(),
})
