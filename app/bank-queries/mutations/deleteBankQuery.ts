import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteBankQuery = z.object({
  id: z.number(),
  enquiryId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteBankQuery),
  resolver.authorize(),
  async ({ id, enquiryId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bankQuery = await db.bankQuery.deleteMany({ where: { id } })

    await db.log.create({
      data: {
        name: "Deleted Bank Query by",
        type: "DELETED",
        enquiryId: enquiryId,
        userId: ctx.session.userId,
      },
    })

    return bankQuery
  }
)
