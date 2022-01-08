import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetBankQueriesInput
  extends Pick<Prisma.BankQueryFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetBankQueriesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: bankQueries,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.bankQuery.count({ where }),
      query: (paginateArgs) => db.bankQuery.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      bankQueries,
      nextPage,
      hasMore,
      count,
    }
  }
)
