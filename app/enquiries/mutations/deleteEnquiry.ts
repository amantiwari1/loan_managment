import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteEnquiry = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteEnquiry),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const enquiry = await db.enquiry.deleteMany({ where: { id } })

    return enquiry
  }
)
