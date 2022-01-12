import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateEnquiry = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const enquiry = await db.enquiry.update({ where: { id }, data })

    return enquiry
  }
)
