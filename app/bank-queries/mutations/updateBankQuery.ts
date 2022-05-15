import { list_of_bank } from "app/core/data/bank"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateBankQuery = z.object({
  id: z.number(),
  enquiryId: z.number(),
  bank_query: z.string(),
  our_response: z.string().optional().default(""),
  remark: z.string().optional().default(""),
})

export default resolver.pipe(
  resolver.zod(UpdateBankQuery),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bankQuery = await db.bankQuery.update({
      where: { id },
      data: {
        bank_query: list_of_bank[data.bank_query],
        our_response: data.our_response,
        remark: data.remark,
        enquiryId: data.enquiryId,
      },
    })

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
