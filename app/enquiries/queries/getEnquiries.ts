import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetEnquiriesInput
  extends Pick<Prisma.EnquiryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetEnquiriesInput, ctx) => {
    if (ctx.session.role === "USER") {
      const {
        items: enquiries,
        hasMore,
        nextPage,
        count,
      } = await paginate({
        skip,
        take,
        count: () =>
          db.enquiry.count({
            where: {
              users: {
                some: {
                  userId: ctx.session.userId,
                },
              },
            },
          }),
        query: (paginateArgs) =>
          db.enquiry.findMany({
            ...paginateArgs,
            where: {
              users: {
                some: {
                  userId: ctx.session.userId,
                },
              },
            },
            orderBy,
          }),
      })

      return {
        enquiries,
        nextPage,
        hasMore,
        count,
      }
    }
    const {
      items: enquiries,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.enquiry.count({ where }),
      query: (paginateArgs) => db.enquiry.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      enquiries,
      nextPage,
      hasMore,
      count,
    }
  }
)
