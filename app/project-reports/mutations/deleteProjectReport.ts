import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteProjectReport = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteProjectReport),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectReport = await db.projectReport.deleteMany({ where: { id } })

    return projectReport
  }
)
