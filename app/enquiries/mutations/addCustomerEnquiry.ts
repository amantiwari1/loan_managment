import { NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateEnquiry = z.object({
  id: z.number(),
  userId: z.number(),
})

export function $exists<T>(ts: T[]): boolean {
  return ts.length > 0
}

export default resolver.pipe(
  resolver.zod(UpdateEnquiry),
  resolver.authorize(),
  async ({ id, userId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const isUser = await db.user
      .findMany({
        where: {
          id: userId,
          role: "USER",
        },
      })
      .then($exists)

    if (!isUser) {
      throw new NotFoundError()
    }

    await db.usersOnEnquires.deleteMany({
      where: {
        enquiryId: id,
        user: {
          role: "USER",
        },
      },
    })

    const enquiry = await db.enquiry.update({
      where: {
        id,
      },
      data: {
        users: {
          create: [
            {
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          ],
        },
      },
    })

    return enquiry
  }
)
