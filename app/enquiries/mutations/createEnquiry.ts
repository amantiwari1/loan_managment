import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { EnquiryValidation } from "./validations"

export default resolver.pipe(
  resolver.zod(EnquiryValidation),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const enquiry = await db.enquiry.create({ data: input })

    return enquiry
  }
)
