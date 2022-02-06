import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateDocument = z.object({
  client_name: z.string(),
  document_name: z.string(),
  enquiryId: z.number(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
  fileId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    console.log(input)

    const modified: any = { ...input, status: input.fileId ? "UPLOADED" : "NOT_UPLOAD" }

    const document = await db.document.create({ data: modified })

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
