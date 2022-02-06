import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateFile = z.object({
  key: z.string(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateFile),
  resolver.authorize(["ADMIN", "STAFF"]),
  async (input: any, ctx) => {
    const file = await db.file.create({ data: input })

    return file
  }
)
