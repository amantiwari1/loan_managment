import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetProjectReport = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProjectReport),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectReport = await db.projectReport.findFirst({ where: { id } })

    if (!projectReport) throw new NotFoundError()

    return projectReport
  }
)
