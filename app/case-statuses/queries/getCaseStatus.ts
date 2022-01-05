import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetCaseStatus = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCaseStatus), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const caseStatus = await db.caseStatus.findFirst({ where: { id } })

  if (!caseStatus) throw new NotFoundError()

  return caseStatus
})
