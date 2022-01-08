import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateSanctionDisbursment = z.object({
  document: z.string(),
  enquiryId: z.number(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
})

export default resolver.pipe(
  resolver.zod(CreateSanctionDisbursment),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.create({ data: input })

    return sanctionDisbursment
  }
)
