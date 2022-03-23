import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDocument = z.object({
  id: z.number(),
  document_name: z.string(),
  enquiryId: z.number(),
  description: z.string().nullable().optional().default(" "),
  remark: z.string().nullable().optional().default(" "),
  file: z.array(z.object({ id: z.number() })).optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateDocument),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    if (ctx.session.role === "USER" || ctx.session.role === "PARTNER") {
      const document = await db.document.update({
        where: { id },
        data: {
          file: {
            connect: data.file.map((arr) => ({ id: arr.id })),
          },
        },
      })
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
    const document = await db.document.update({
      where: { id },
      data: {
        document_name: data.document_name,
        remark: data.remark,
        enquiryId: data.enquiryId,
        file: {
          connect: data.file.map((arr) => ({ id: arr.id })),
        },
      },
    })
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
