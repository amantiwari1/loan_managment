import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetEnquiry = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetEnquiry), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const enquiry = await db.enquiry.findFirst({ where: { id } })

  if (!enquiry) throw new NotFoundError()

  return enquiry
})
