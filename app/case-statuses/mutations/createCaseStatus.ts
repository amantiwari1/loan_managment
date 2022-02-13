import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCaseStatus = z.object({
  bank_name: z.string(),
  final_login: z.boolean(),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateCaseStatus),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input, ctx) => {
    const caseStatus = await db.caseStatus.create({
      data: {
        bank_name: input.bank_name,
        final_login: input.final_login,
        enquiryId: input.enquiryId,
        remark: input.remark,
      },
    })

    if (input.final_login) {
      await db.bankQuery.create({
        data: {
          bank_query: input.bank_name,
          enquiryId: input.enquiryId,
          our_response: "",
        },
      })
    }
    await db.log.create({
      data: {
        name: "Created Case Status by",
        type: "CREATED",
        enquiryId: input.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return caseStatus
  }
)
