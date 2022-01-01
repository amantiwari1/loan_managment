import { z } from "zod"

const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

const name = z.string().max(50)

const role = z.enum(["ADMIN", "USER", "STAFF", "PARTNER"])

export const CreateUserVALIDATION = z.object({
  email,
  password,
  role,
  name,
})
