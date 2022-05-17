import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetBankQuery = z.object({
  enquiryId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetBankQuery),
  resolver.authorize(),
  async ({ enquiryId }) => {
    const caseStatus = await db.caseStatus.findFirst({
      select: {
        id: true,
        bank_name: true,
        case_status: true,
      },
      where: { enquiryId, final_login: true },
    })

    if (!caseStatus) return null

    return caseStatus
  }
)
