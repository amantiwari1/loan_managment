import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTeaser = z.object({
  id: z.number(),
  data: z.any(),
})

export default resolver.pipe(
  resolver.zod(UpdateTeaser),
  resolver.authorize(),
  async ({ id, ...data }) => {
    console.log("🚀 ~ file: updateTeaser.ts ~ line 14 ~ data", data)
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const teaser = await db.teaser.update({ where: { id }, data })

    return teaser
  }
)
