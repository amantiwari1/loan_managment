import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteSanctionDisbursment = z.object({
  id: z.number(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteSanctionDisbursment),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, enquiryId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.deleteMany({ where: { id } })

    await db.log.create({
      data: {
        name: "Deleted Sanction Disbursment by",
        type: "DELETED",
        enquiryId: enquiryId,
        userId: ctx.session.userId,
      },
    })

    return sanctionDisbursment
  }
)
