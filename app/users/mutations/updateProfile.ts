import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateUser = z.object({
  name: z.string().max(50),
})
export default resolver.pipe(resolver.zod(UpdateUser), resolver.authorize(), async (data, ctx) => {
  delete data["email"]
  delete data["role"]
  const user = await db.user.update({ where: { id: ctx.session.userId }, data })

  return user
})
