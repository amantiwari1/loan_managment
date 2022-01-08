import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetBankQuery = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetBankQuery), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const bankQuery = await db.bankQuery.findFirst({ where: { id } })

  if (!bankQuery) throw new NotFoundError()

  return bankQuery
})
