import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateDocument = z.object({
  client_name: z.string(),
  document_name: z.string(),
  enquiryId: z.number(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
})

export default resolver.pipe(
  resolver.zod(CreateDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
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
