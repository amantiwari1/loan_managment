import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteSearchValuationReport = z.object({
  id: z.number(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteSearchValuationReport),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, enquiryId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchValuationReport = await db.searchValuationReport.deleteMany({ where: { id } })

    await db.log.create({
      data: {
        name: "Deleted Search Valuation by",
        type: "DELETED",
        enquiryId: enquiryId,
        userId: ctx.session.userId,
      },
    })

    return searchValuationReport
  }
)
