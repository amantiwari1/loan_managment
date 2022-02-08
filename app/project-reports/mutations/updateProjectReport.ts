import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProjectReport = z.object({
  id: z.number(),
  label: z.string(),
  fileId: z.number().optional().nullable(),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateProjectReport),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectReport = await db.projectReport.update({ where: { id }, data })
    await db.log.create({
      data: {
        name: "Updated Project Report by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return projectReport
  }
)
