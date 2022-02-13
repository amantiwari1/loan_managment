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
  request: z.enum(["PENDING", "APPROVED", "REJECTED", "SANCTIONED"]),
})

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 720

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(["ADMIN"]),
  async ({ id, request }) => {
    const enquiry = await db.channelPartner.update({
      where: { id },
      data: { request: request },
    })

    if (request === "APPROVED") {
      const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
      const hashedPassword = await SecurePassword.hash(generatePassword().trim())
      const user = await db.user.create({
        data: {
          email: enquiry.email.toLowerCase().trim(),
          hashedPassword,
          role: "PARTNER",
          name: enquiry.name,
        },
        select: { id: true, name: true, email: true, role: true },
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
