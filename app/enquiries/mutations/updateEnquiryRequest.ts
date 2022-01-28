import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateEnquiry = z.object({
  id: z.number(),
  enquiry_request: z.enum(["PENDING", "APPROVED", "REJECTED", "SANCTIONED"]),
})

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(["ADMIN"]),
  async ({ id, enquiry_request }: any) => {
    const enquiry = await db.enquiry.update({
      where: { id },
      data: { enquiry_request: enquiry_request as any },
    })

    return enquiry
  }
)
