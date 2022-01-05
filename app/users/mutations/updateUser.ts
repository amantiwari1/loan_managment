import { resolver } from "blitz"
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
})
export default resolver.pipe(
  resolver.zod(UpdateUser),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const user = await db.user.update({ where: { id }, data })

    return user
  }
)
