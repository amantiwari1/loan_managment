import { ChannelPartnerValidation } from "app/enquiries/mutations/validations"
import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.zod(ChannelPartnerValidation), async (input: any) => {
  const channelPartner = await db.channelPartner.create({
    data: { ...input, request: "PENDING" },
  })
  return channelPartner
})
