import { list_of_bank } from "app/core/data/bank"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCaseStatus = z.object({
  id: z.number(),
  bank_code: z.string(),
  final_login: z.boolean(),
  remark: z.string().default("no remark").optional(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateCaseStatus),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    const caseStatus = await db.caseStatus.update({
      where: { id },
      data: {
        bank_query: list_of_bank[data.bank_code],
        bank_code: data.bank_code,
        final_login: data.final_login,
        remark: data.remark,
      },
    })

    if (data.final_login) {
      if (caseStatus.bankQueryId) {
        await db.bankQuery.update({
          data: {
            bank_query: list_of_bank[data.bank_code],
            bank_code: data.bank_code,
          },
          where: {
            id: caseStatus.bankQueryId,
          },
        })
      } else {
        await db.bankQuery.create({
          data: {
            CaseStatus: {
              connect: {
                id: caseStatus.id,
              },
            },
            bank_query: list_of_bank[data.bank_code],
            bank_code: data.bank_code,
            our_response: "",
          },
        })
      }
    }

    await db.log.create({
      data: {
        name: "Updated Case Status by",
        type: "UPDATED",
        userId: ctx.session.userId,
        enquiryId: data.enquiryId,
      },
    })

    return caseStatus
  }
)
