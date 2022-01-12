import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDocument = z.object({
  id: z.number(),
  document_name: z.string(),
  enquiryId: z.number(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
})

export default resolver.pipe(
  resolver.zod(UpdateDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const document = await db.document.update({ where: { id }, data })
    await db.log.create({
      data: {
        name: "Updated Document by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return document
  }
)
