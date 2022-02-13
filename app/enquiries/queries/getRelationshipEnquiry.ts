import { resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"

interface Input {
  id?: number
  select: Prisma.EnquiryFindFirstArgs["select"]
}

const GetEnquiry = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
  select: z.unknown(),
})

export default resolver.pipe(
  resolver.zod(GetEnquiry),
  resolver.authorize(),
  async ({ id, select }, ctx) => {
    let Options: Prisma.EnquiryFindFirstArgs = {
      where: {
        id,
        users: {
          some: {
            userId: ctx.session.userId,
          },
        },
      },
      select,
    }

    if (ctx.session.role === "ADMIN") {
      Options = {
        where: {
          id,
        },
        select,
      }
    }

    const enquiry = await db.enquiry.findFirst(Options)

    if (!enquiry) throw new NotFoundError()

    return enquiry
  }
)
