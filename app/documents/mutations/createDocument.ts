import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateDocument = z.object({
  client_name: z.string(),
  document_name: z.string(),
  description: z.string().default(""),
  remark: z.string().default(""),
  enquiryId: z.number(),
  file: z.array(z.object({ id: z.number() })).optional(),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input, ctx) => {
    const document = await db.document.create({
      data: {
        client_name: input.client_name,
        document_name: input.document_name,
        description: input.description,
        remark: input.remark,
        enquiryId: input.enquiryId,
        file: {
          connect: input.file.map((arr) => ({ id: arr.id })),
        },
      },
    })

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
