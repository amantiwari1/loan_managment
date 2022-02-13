import { generateToken, hash256, resolver, SecurePassword } from "blitz"
import db from "db"
import { z } from "zod"

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = ""
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}
const UpdateEnquiry = z.object({
  id: z.number(),
  enquiry_request: z.enum(["PENDING", "APPROVED", "REJECTED", "SANCTIONED"]),
})

const CreateUser = z.object({
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
  password: z
    .string()
    .min(10)
    .max(100)
    .transform((str) => str.trim()),
  name: z.string().max(50),
  role: z.enum(["ADMIN", "USER", "STAFF", "PARTNER"]),
})

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 720

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(["ADMIN"]),
  async ({ id, enquiry_request }) => {
    const enquiry = await db.enquiry.update({
      where: { id },
      data: { enquiry_request: enquiry_request },
    })

    if (enquiry_request === "APPROVED") {
      const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
      const hashedPassword = await SecurePassword.hash(generatePassword().trim())
      const user = await db.user.create({
        data: {
          email: enquiry.client_email.toLowerCase().trim(),
          hashedPassword,
          role: "USER",
          name: enquiry.client_name,
        },
        select: { id: true, name: true, email: true, role: true },
      })

      await db.usersOnEnquires.create({
        data: {
          enquiryId: id,
          userId: user.id,
        },
      })

      const token = generateToken(32)
      const hashedToken = hash256(token)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

      await db.token.deleteMany({ where: { type: "INVITE_PASSWORD", userId: user.id } })
      // 5. Save this new token in the database.
      await db.token.create({
        data: {
          user: { connect: { id: user.id } },
          type: "INVITE_PASSWORD",
          expiresAt,
          hashedToken,
          sentTo: user.email,
        },
      })

      const resetUrl = `${origin}/welcome-password?token=${token}`
      return resetUrl
    }
    return enquiry
  }
)
