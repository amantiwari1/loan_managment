import { z } from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const role = z.enum(["ADMIN", "USER", "STAFF", "PARTNER"]).default("USER")

export const status = z.enum(["UPLOADED", "NOT_UPLOAD"])
export const id = z.number().optional()

export const Signup = z.object({
  email,
  password,
  role,
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})

// USER
export const CreateUser = z.object({
  email,
  password,
  name: z.string().min(3).max(50),
  role,
})

export const UpdateUser = z.object({
  email,
  name: z.string().min(3).max(50),
  role,
})
export const ProfileUser = z.object({
  email,
  name: z.string().min(3).max(50),
})

// Project Report
export const CreateProjectReport = z.object({
  label: z.string({
    required_error: "Label is required",
    invalid_type_error: "Label is required",
  }),
  remark: z.string().default("no remark").optional(),
})

export const CreateCaseStatus = z.object({
  id,
  bank_code: z.string({
    required_error: "Label is required",
    invalid_type_error: "Label is required",
  }),
  final_login: z.boolean(),
  remark: z.string().default("no remark").optional(),
  enquiryId: z.number(),
})

// Document
export const CreateDocument = z.object({
  id,
  document_name: z
    .string({
      required_error: "Document name is required",
    })
    .min(3)
    .max(50),
  remark: z.string().default("no remark").optional(),
  description: z.string().default("no description").optional(),
})

const isValidPhoneNumber = (phonenumber: unknown) => `${phonenumber}`.length > 9

const client_name = z.string()
const client_mobile = z
  .custom<string>(isValidPhoneNumber, { message: "Not a valid phone number" })
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

export const CreateEnquiry = z.object({
  client_name,
  client_mobile,
  client_email,
  client_service,
  client_qccupation_type,
  loan_amount,
  client_address,
  private_enquiry,
})

export const CreateChannelPartner = z.object({
  name: client_name,
  phone: client_mobile,
  email: client_email,
  company: z.string(),
  city: z.string(),
})
