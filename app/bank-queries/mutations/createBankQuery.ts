import { list_of_bank } from "app/core/data/bank"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateBankQuery = z.object({
  bank_code: z.string(),
  our_response: z.string().optional().default(""),
  enquiryId: z.number(),
  remark: z.string().optional().default(""),
})

export default resolver.pipe(
  resolver.zod(CreateBankQuery),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input, ctx) => {
    const bankQuery = await db.bankQuery.create({
      data: {
        bank_query: list_of_bank[input.bank_code],
        bank_code: input.bank_code,
        our_response: input.our_response,
        remark: input.remark,
        enquiryId: input.enquiryId,
      },
    })
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
