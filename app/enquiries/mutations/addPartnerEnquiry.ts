import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateEnquiry = z.object({
  id: z.number(),
  userId: z.array(z.number()),
})

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(["ADMIN"]),
  async ({ id, userId }) => {
    const connectUserStaff = userId.map((arr) => {
      return {
        enquiryId: id,
        userId: arr,
      }
    })

    await db.usersOnEnquires.deleteMany({
      where: {
        enquiryId: id,
        user: {
          role: "PARTNER",
        },
      },
    })
    await db.usersOnEnquires.createMany({
      data: connectUserStaff,
    })
  }
)
