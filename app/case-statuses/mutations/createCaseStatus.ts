import { list_of_bank } from "app/core/data/bank"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCaseStatus = z.object({
  bank_code: z.string(),
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
        bank_name: list_of_bank[input.bank_code],
        bank_code: input.bank_code,
        final_login: input.final_login,
        enquiryId: input.enquiryId,
        remark: input.remark,
      },
    })

    if (input.final_login) {
      await db.bankQuery.create({
        data: {
          CaseStatus: {
            connect: {
              id: caseStatus.id,
            },
          },
          bank_query: list_of_bank[input.bank_code],
          bank_code: input.bank_code,
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
