import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetChannelPartner = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetChannelPartner),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const channelPartner = await db.channelPartner.findFirst({ where: { id } })

    if (!channelPartner) throw new NotFoundError()

    return channelPartner
  }
)
