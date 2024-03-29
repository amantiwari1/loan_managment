import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetUsersInput
  extends Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(["ADMIN", "STAFF"]),
  async ({ where, orderBy, skip = 0, take = 100 }: GetUsersInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: users,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.user.count({ where }),
      query: (paginateArgs) =>
        db.user.findMany({
          ...paginateArgs,
          where,
          orderBy,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        }),
    })

    return {
      users,
      nextPage,
      hasMore,
      count,
    }
  }
)
