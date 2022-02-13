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
        bank_name: data.bank_name,
        final_login: data.final_login,
        enquiryId: data.enquiryId,
        remark: data.remark,
      },
    })

    if (data.final_login) {
      await db.bankQuery.upsert({
        where: {
          id: caseStatus.bankQueryId,
        },
        create: {
          bank_query: data.bank_name,
          enquiryId: data.enquiryId,
          our_response: "",
        },
        update: {
          bank_query: data.bank_name,
        },
      })
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
