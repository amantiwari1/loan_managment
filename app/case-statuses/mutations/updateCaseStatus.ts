import { list_of_bank } from "app/core/data/bank"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCaseStatus = z.object({
  id: z.number(),
  bank_name: z.string(),
  final_login: z.boolean(),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateCaseStatus),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    const caseStatus = await db.caseStatus.update({
      where: { id },
      data: {
        bank_name: list_of_bank[data.bank_name],
        final_login: data.final_login,
        enquiryId: data.enquiryId,
        remark: data.remark,
      },
    })

    if (data.final_login) {
      if (caseStatus.bankQueryId) {
        await db.bankQuery.update({
          data: {
            bank_query: data.bank_name,
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
            bank_query: data.bank_name,
            enquiryId: data.enquiryId,
            our_response: "",
          },
        })
      }
    }

    await db.log.create({
      data: {
        name: "Updated Case Status by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return caseStatus
  }
)
