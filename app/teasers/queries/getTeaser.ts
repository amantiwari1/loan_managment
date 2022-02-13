import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetTeaser = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTeaser), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const teaser = await db.teaser.findFirst({ where: { id } })

  if (!teaser) throw new NotFoundError()

  return teaser
})
