import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetDocument = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetDocument), resolver.authorize(), async ({ id }) => {
  const document = await db.document.findFirst({ where: { id } })

  if (!document) throw new NotFoundError()

  return document
})
