import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetChannelPartnersInput
  extends Pick<Prisma.ChannelPartnerFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetChannelPartnersInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: channelPartners,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.channelPartner.count({ where }),
      query: (paginateArgs) => db.channelPartner.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      channelPartners,
      nextPage,
      hasMore,
      count,
    }
  }
)
