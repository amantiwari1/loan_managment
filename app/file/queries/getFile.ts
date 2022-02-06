import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetDocument = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetDocument), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const file = await db.file.findFirst({ where: { id } })

  if (!file) throw new NotFoundError()

  return file
})
