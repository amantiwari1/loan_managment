import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateDocument = z.object({
  client_name: z.string(),
  document_name: z.string(),
  description: z.string().default(""),
  remark: z.string().default(""),
  enquiryId: z.number(),
  fileId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    const document = await db.document.create({ data: input })

    await db.log.create({
      data: {
        name: "Created Document by",
        type: "CREATED",
        enquiryId: input.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return document
  }
)
