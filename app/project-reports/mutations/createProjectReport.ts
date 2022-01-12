import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateProjectReport = z.object({
  id: z.number().optional(),
  label: z.string(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateProjectReport),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectReport = await db.projectReport.create({ data: input })

    await db.log.create({
      data: {
        name: "Created Project Report by",
        type: "CREATED",
        enquiryId: input.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return projectReport
  }
)