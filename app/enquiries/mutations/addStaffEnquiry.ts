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
        user: {
          connect: {
            id: arr,
          },
        },
      }
    })

    const enquiry = await db.enquiry.update({
      where: {
        id,
      },
      data: {
        users: {
          create: connectUserStaff,
        },
      },
    })

    return enquiry
  }
)
