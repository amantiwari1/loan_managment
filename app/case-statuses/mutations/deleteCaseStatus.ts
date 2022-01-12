import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCaseStatus = z.object({
  id: z.number(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteCaseStatus),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, enquiryId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const caseStatus = await db.caseStatus.deleteMany({ where: { id } })

    await db.log.create({
      data: {
        name: "Deleted Case Status by",
        type: "DELETED",
        enquiryId: enquiryId,
        userId: ctx.session.userId,
      },
    })

    return caseStatus
  }
)
