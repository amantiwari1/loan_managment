import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateBankQuery = z.object({
  id: z.number(),
  enquiryId: z.number(),
  bank_query: z.string(),
  our_response: z.string(),
  remark: z.string().optional().default(""),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
})

export default resolver.pipe(
  resolver.zod(UpdateBankQuery),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bankQuery = await db.bankQuery.update({ where: { id }, data })

    await db.log.create({
      data: {
        name: "Updated Project Report by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return bankQuery
  }
)
