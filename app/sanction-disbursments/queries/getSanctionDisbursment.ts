import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetSanctionDisbursment = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetSanctionDisbursment),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.findFirst({ where: { id } })

    if (!sanctionDisbursment) throw new NotFoundError()

    return sanctionDisbursment
  }
)
