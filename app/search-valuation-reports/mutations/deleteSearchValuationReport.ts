import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteSearchValuationReport = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteSearchValuationReport),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchValuationReport = await db.searchValuationReport.deleteMany({ where: { id } })

    return searchValuationReport
  }
)
