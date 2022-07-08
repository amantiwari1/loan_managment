import { resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"

const GetEnquiry = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

interface Options {
  where: {
    id: number
  }
  include: {
    users: {
      where?: {
        userId: number
      }
      include: {
        user: boolean
      }
    }
  }
}

export default resolver.pipe(
  resolver.zod(GetEnquiry),
  resolver.authorize(),
  async ({ id }, ctx) => {
    let options: any = {
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                name: true,
                role: true,
                id: true,
                email: true,
              },
            },
          },
        },
      },
    }

    if (["USER", "PARTNER", "STAFF"].includes(ctx.session.role)) {
      options = {
        where: {
          id,
        },
        include: {
          users: {
            where: {
              userId: ctx.session.userId,
            },
            include: {
              user: {
                select: {
                  name: true,
                  role: true,
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      }
    }

    const enquiry: any = await db.enquiry.findFirst(options)

    if (!enquiry) throw new NotFoundError()

    const partner = enquiry.users.filter((arr) => arr.user.role === "PARTNER")
    const customer = enquiry.users.filter((arr) => arr.user.role === "USER")[0]
    const staff = enquiry.users.filter((arr) => arr.user.role === "STAFF")

    return { ...enquiry, partner, customer, staff }
  }
)
