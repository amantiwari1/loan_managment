import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProjectReport = z.object({
  id: z.number(),
  label: z.string(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
  remark: z.string().optional().default(""),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateProjectReport),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectReport = await db.projectReport.update({ where: { id }, data })

    return projectReport
  }
)
