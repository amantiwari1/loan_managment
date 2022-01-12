import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteProjectReport = z.object({
  id: z.number(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteProjectReport),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, enquiryId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectReport = await db.projectReport.deleteMany({ where: { id } })
    await db.log.create({
      data: {
        name: "Deleted Project Report by",
        type: "DELETED",
        enquiryId: enquiryId,
        userId: ctx.session.userId,
      },
    })
    return projectReport
  }
)
