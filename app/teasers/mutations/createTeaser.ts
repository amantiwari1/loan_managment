import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTeaser = z.object({
  enquiryId: z.number(),
  data: z.any(),
})

export default resolver.pipe(resolver.zod(CreateTeaser), resolver.authorize(), async (input) => {
  const teaser = await db.teaser.create({ data: input })

  return teaser
})
