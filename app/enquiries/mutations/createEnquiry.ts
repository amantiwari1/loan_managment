import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateEnquiry = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateEnquiry), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const enquiry = await db.enquiry.create({ data: input })

  return enquiry
})
