import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateBankQuery = z.object({
  bank_query: z.string(),
  our_response: z.string(),
  enquiryId: z.number(),
  remark: z.string().optional().default(""),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
})

export default resolver.pipe(
  resolver.zod(CreateBankQuery),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bankQuery = await db.bankQuery.create({ data: input })
    await db.log.create({
      data: {
        name: "Created Bank Query by",
        type: "CREATED",
        enquiryId: input.enquiryId,
        userId: ctx.session.userId,
      },
    })
    return bankQuery
  }
)
