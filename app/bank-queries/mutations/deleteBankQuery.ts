import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteBankQuery = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteBankQuery),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bankQuery = await db.bankQuery.deleteMany({ where: { id } })

    return bankQuery
  }
)
