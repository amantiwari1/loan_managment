import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateSanctionDisbursment = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateSanctionDisbursment),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.update({ where: { id }, data })

    return sanctionDisbursment
  }
)
