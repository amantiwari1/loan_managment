import { list_of_bank } from "app/core/data/bank"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateBankQuery = z.object({
  id: z.number(),
  enquiryId: z.number(),
  case_status: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateBankQuery),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    const bankQuery = await db.caseStatus.update({
      where: { id },
      data: {
        case_status: data.case_status,
      },
    })

    await db.log.create({
      data: {
        name: "Updated Bank Query by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return bankQuery
  }
)
