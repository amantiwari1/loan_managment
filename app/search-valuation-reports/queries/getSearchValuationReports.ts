import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetSearchValuationReportsInput
  extends Pick<Prisma.SearchValuationReportFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetSearchValuationReportsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: searchValuationReports,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.searchValuationReport.count({ where }),
      query: (paginateArgs) =>
        db.searchValuationReport.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      searchValuationReports,
      nextPage,
      hasMore,
      count,
    }
  }
)
