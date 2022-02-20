import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateSanctionDisbursment = z.object({
  document: z.string().default(" "),
  client_name: z.string(),
  bank_name: z.string(),
  product: z.enum([
    "HOME_LOAN",
    "MORTGAGE_LOAN",
    "UNSECURED_LOAN",
    "MSME_LOAN",
    "STARTUP_LOAN",
    "SUBSIDY_SCHEMES",
  ]),
  tenure: z.string().optional().nullable(),
  date_of_sanction: z.date().optional().nullable(),
  amount_sanctioned: z.number(),
  rate_of_interest: z.number().optional().nullable(),
  remark: z.string().optional().nullable(),
  enquiryId: z.number(),
  fileId: z.number().optional().nullable(),
})

export default resolver.pipe(
  resolver.zod(CreateSanctionDisbursment),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const sanctionDisbursment = await db.sanctionDisbursment.create({ data: input })

    await db.log.create({
      data: {
        name: "Created Sanction Disbursement by",
        type: "CREATED",
        enquiryId: input.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return sanctionDisbursment
  }
)
