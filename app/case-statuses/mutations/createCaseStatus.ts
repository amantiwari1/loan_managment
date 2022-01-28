import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCaseStatus = z.object({
  bank_name: z.string(),
  final_login: z.string(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
  response_from_bank: z.boolean().default(false),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateCaseStatus),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const caseStatus = await db.caseStatus.create({ data: input })

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
