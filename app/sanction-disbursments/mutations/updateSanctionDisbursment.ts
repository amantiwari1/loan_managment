import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateSanctionDisbursment = z.object({
  id: z.number(),
  document: z.string(),
  enquiryId: z.number(),
  status: z.enum(["UPLOADED", "NOT_UPLOAD"]),
})

export default resolver.pipe(
  resolver.zod(UpdateSanctionDisbursment),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.update({ where: { id }, data })

    await db.log.create({
      data: {
        name: "Updated Sanction Disbursment by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return sanctionDisbursment
  }
)
