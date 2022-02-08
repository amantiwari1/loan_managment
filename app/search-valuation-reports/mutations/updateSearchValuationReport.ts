import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateSearchValuationReport = z.object({
  id: z.number(),
  document: z.string(),
  enquiryId: z.number(),
  fileId: z.number().optional().nullable(),
})

export default resolver.pipe(
  resolver.zod(UpdateSearchValuationReport),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchValuationReport = await db.searchValuationReport.update({ where: { id }, data })

    await db.log.create({
      data: {
        name: "Updated Search Valuation Report by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return searchValuationReport
  }
)
