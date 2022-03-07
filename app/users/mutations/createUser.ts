import { generateToken, hash256, resolver, SecurePassword } from "blitz"
import db from "db"
import { z } from "zod"

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
  resolver.zod(CreateUser),
  resolver.authorize("ADMIN"),
  async ({ email, password, role, name }, ctx) => {
    const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.create({
      data: { email: email.toLowerCase().trim(), hashedPassword, role, name },
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

    return token
  }
)
