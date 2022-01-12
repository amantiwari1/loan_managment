import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCaseStatus = z.object({
  id: z.number(),
  bank_name: z.string(),
  final_login: z.string(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
  response_from_bank: z.boolean().default(false),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateCaseStatus),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const caseStatus = await db.caseStatus.update({ where: { id }, data })

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
