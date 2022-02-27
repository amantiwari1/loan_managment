import { resolver, SecurePassword, hash256 } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateUser = z.object({
  id: z.number(),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase().trim()),
  name: z.string().max(50),
  role: z.enum(["ADMIN", "USER", "STAFF", "PARTNER"]),
  password: z.string().optional().default(null),
})
export default resolver.pipe(
  resolver.zod(UpdateUser),
  resolver.authorize("ADMIN"),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    if (data.password) {
      const hashedPassword = await SecurePassword.hash(data.password.trim())
      const user = await db.user.update({ where: { id }, data: { ...data, hashedPassword } })
      return user
    } else {
      const user = await db.user.update({ where: { id }, data })

      return user
    }
  }
)
