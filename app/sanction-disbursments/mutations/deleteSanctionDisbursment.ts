import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteSanctionDisbursment = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteSanctionDisbursment),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.deleteMany({ where: { id } })

    return sanctionDisbursment
  }
)
