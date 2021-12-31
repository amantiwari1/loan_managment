import { generateToken, hash256, resolver, SecurePassword } from "blitz"
import db from "db"
import { z } from "zod"

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 24

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const role = z.enum(["ADMIN", "USER", "STAFF", "PARTNER"])

const CreateUser = z.object({
  email,
  password,
  role,
})

export default resolver.pipe(
  resolver.zod(CreateUser),
  resolver.authorize(),
  async ({ email, password, role }, ctx) => {
    const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: { email: email.toLowerCase().trim(), hashedPassword, role: role },
      select: { id: true, name: true, email: true, role: true },
    })

    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

    await db.token.deleteMany({ where: { type: "RESET_PASSWORD", userId: user.id } })
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

    const resetUrl = `${origin}/reset-password?token=${token}`
    return resetUrl
  }
)
