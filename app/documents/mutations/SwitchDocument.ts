import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDocument = z.object({
  id: z.number(),
  enquiryId: z.number(),
  is_public_user: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateDocument),
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ id, ...data }, ctx) => {
    const modified: any = { ...data }
    const document = await db.document.update({ where: { id }, data: modified })
    await db.log.create({
      data: {
        name: "Updated Document by",
        type: "UPDATED",
        enquiryId: data.enquiryId,
        userId: ctx.session.userId,
      },
    })

    return document
  }
)
