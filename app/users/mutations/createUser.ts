import { generateToken, hash256, resolver, SecurePassword } from "blitz"
import db from "db"
import { z } from "zod"
import { CreateUserVALIDATION } from "./validations"

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 24

export default resolver.pipe(
  resolver.zod(CreateUserVALIDATION),
  resolver.authorize(),
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

    const resetUrl = `${origin}/welcome-password?token=${token}`
    return resetUrl
  }
)
