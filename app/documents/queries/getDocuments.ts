import { AuthenticatedMiddlewareCtx, paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"

interface GetDocumentsInput
  extends Pick<Prisma.DocumentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetDocumentsInput) => {
    const {
      items: documents,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.document.count({ where }),
      query: (paginateArgs) =>
        db.document.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            file: true,
          },
        }),
    })

    return {
      documents,
      nextPage,
      hasMore,
      count,
    }
  }
)
