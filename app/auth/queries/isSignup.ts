import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(async (_, ctx) => {
  const count = await db.user.count()
  if (count !== 0) {
    return false
  }
  return true
})
