import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetCaseStatusesInput
  extends Pick<Prisma.CaseStatusFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCaseStatusesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: caseStatuses,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.caseStatus.count({ where }),
      query: (paginateArgs) => db.caseStatus.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      caseStatuses,
      nextPage,
      hasMore,
      count,
    }
  }
)
