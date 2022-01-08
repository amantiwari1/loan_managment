import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateBankQuery = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateBankQuery),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const bankQuery = await db.bankQuery.update({ where: { id }, data })

    return bankQuery
  }
)
