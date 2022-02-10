import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateChannelPartner = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateChannelPartner),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const channelPartner = await db.channelPartner.update({ where: { id }, data })

    return channelPartner
  }
)
