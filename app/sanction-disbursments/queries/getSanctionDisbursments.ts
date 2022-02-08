import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetSanctionDisbursmentsInput
  extends Pick<Prisma.SanctionDisbursmentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetSanctionDisbursmentsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: sanctionDisbursments,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.sanctionDisbursment.count({ where }),
      query: (paginateArgs) =>
        db.sanctionDisbursment.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            file: true,
          },
        }),
    })

    return {
      sanctionDisbursments,
      nextPage,
      hasMore,
      count,
    }
  }
)
