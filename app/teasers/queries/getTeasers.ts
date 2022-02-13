import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTeasersInput
  extends Pick<Prisma.TeaserFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTeasersInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: teasers,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.teaser.count({ where }),
      query: (paginateArgs) => db.teaser.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      teasers,
      nextPage,
      hasMore,
      count,
    }
  }
)
