import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDocument = z.object({
  id: z.number(),
  document_name: z.string(),
  enquiryId: z.number(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
  fileId: z.number().nullish(),
})

export default resolver.pipe(
  resolver.zod(UpdateDocument),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    if (ctx.session.role === "USER" || ctx.session.role === "PARTNER") {
      const document = await db.document.update({ where: { id }, data: { fileId: data.fileId } })
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
    const modified: any = { ...data }
    const document = await db.document.update({ where: { id }, data: modified })
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
