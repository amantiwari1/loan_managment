import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetSearchValuationReport = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetSearchValuationReport),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchValuationReport = await db.searchValuationReport.findFirst({ where: { id } })

    if (!searchValuationReport) throw new NotFoundError()

    return searchValuationReport
  }
)
