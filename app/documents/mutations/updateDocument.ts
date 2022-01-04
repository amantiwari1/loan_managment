import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDocument = z.object({
  id: z.number(),
  document_name: z.string(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateDocument),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const document = await db.document.update({ where: { id }, data })

    await db.log.create({
      data: {
        name: "Updated Document by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
      },
    })

    return document
  }
)
