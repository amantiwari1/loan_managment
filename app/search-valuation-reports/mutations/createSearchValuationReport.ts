import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateSearchValuationReport = z.object({
  document: z.string(),
  enquiryId: z.number(),
  fileId: z.number().optional().nullable(),
})

export default resolver.pipe(
  resolver.zod(CreateSearchValuationReport),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchValuationReport = await db.searchValuationReport.create({ data: input })
    await db.log.create({
      data: {
        name: "Created Search Valuation by",
        type: "CREATED",
        enquiryId: input.enquiryId,
        userId: ctx.session.userId,
      },
    })
    return searchValuationReport
  }
)
