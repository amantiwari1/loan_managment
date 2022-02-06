import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateEnquiry = z.object({
  id: z.number(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(["ADMIN"]),
  async ({ id, userId }) => {
    await db.usersOnEnquires.deleteMany({
      where: {
        enquiryId: id,
        user: {
          role: "USER",
        },
      },
    })
    await db.usersOnEnquires.create({
      data: {
        enquiryId: id,
        userId: userId,
      },
    })
  }
)
