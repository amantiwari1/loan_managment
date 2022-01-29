import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

export default resolver.pipe(resolver.authorize(), async ({}, ctx) => {
  const active = await db.enquiry.count({
    where: {
      enquiry_request: "APPROVED",
    },
  })
  const pending = await db.enquiry.count({
    where: {
      enquiry_request: "PENDING",
    },
  })
  const reject = await db.enquiry.count({
    where: {
      enquiry_request: "REJECTED",
    },
  })
  const sanction = await db.enquiry.count({
    where: {
      enquiry_request: "SANCTIONED",
    },
  })

  return {
    active,
    reject,
    sanction,
    pending,
  }
})
