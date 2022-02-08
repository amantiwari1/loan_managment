import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetProjectReportsInput
  extends Pick<Prisma.ProjectReportFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetProjectReportsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projectReports,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.projectReport.count({ where }),
      query: (paginateArgs) =>
        db.projectReport.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            file: true,
          },
        }),
    })

    return {
      projectReports,
      nextPage,
      hasMore,
      count,
    }
  }
)
