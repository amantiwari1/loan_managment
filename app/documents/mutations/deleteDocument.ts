import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteDocument = z.object({
  id: z.number(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, enquiryId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const document = await db.document.deleteMany({ where: { id } })
    await db.log.create({
      data: {
        name: "Deleted Document by",
        type: "DELETED",
        enquiryId: enquiryId,
        userId: ctx.session.userId,
      },
    })
    return document
  }
)
