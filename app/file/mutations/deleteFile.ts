import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteFile = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteFile),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id }, ctx) => {
    const file = await db.file.delete({ where: { id } })

    return file
  }
)
