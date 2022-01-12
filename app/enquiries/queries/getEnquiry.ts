import { resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"

const GetEnquiry = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetEnquiry),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    let options: any = {
      where: { id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    }

    if (ctx.session.role === "USER") {
      options = {
        where: {
          id,
          users: {
            some: {
              userId: ctx.session.userId,
            },
          },
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      }
    }

    const enquiry: any = await db.enquiry.findFirst(options)

    if (!enquiry) throw new NotFoundError()

    const partner = enquiry.users.filter((arr) => arr.user.role === "PARTNER")[0]
    const customer = enquiry.users.filter((arr) => arr.user.role === "USER")[0]

    return { ...enquiry, partner, customer }
  }
)
