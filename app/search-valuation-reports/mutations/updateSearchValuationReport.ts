import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateSearchValuationReport = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateSearchValuationReport),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const searchValuationReport = await db.searchValuationReport.update({ where: { id }, data })

    return searchValuationReport
  }
)
