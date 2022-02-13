import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteTeaser = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteTeaser), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const teaser = await db.teaser.deleteMany({ where: { id } })

  return teaser
})
