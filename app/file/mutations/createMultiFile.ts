import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateFile = z.object({
  files: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
    })
  ),
})

export default resolver.pipe(resolver.zod(CreateFile), resolver.authorize(), async (input, ctx) => {
  const file = await db.$transaction(
    input.files.map((arr) =>
      db.file.create({
        data: {
          key: arr.key,
          name: arr.name,
        },
      })
    )
  )

  return file
})
