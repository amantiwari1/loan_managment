import { client_service_options } from "app/common"
import { NotFoundError, resolver } from "blitz"
import db from "db"
import { sendIntimationMailer } from "mailers/sendIntimationMailer"

interface Options {
  where: {
    id: number
  }
  include: {
    users: {
      where?: {
        userId: number
      }
      include: {
        user: boolean
      }
    }
  }
}

export default resolver.pipe(async ({ id }) => {
  let options: Options = {
    where: { id },
    include: {
      users: {
        include: {
          user: true,
        },
      },
    },
  }

  const enquiry = await db.enquiry.findFirst(options)

  if (!enquiry) throw new NotFoundError()

  const partner = enquiry.users.filter((arr) => arr.user.role === "PARTNER")
  const customer = enquiry.users.filter((arr) => arr.user.role === "USER")[0]

  if (!customer.user.email || (partner.length !== 0 && !partner[0].user.email)) {
    throw new NotFoundError()
  }

  const data = {
    name: customer.user.name ?? partner[0].user.name ?? "",
    email: customer.user.email ?? partner[0].user.email ?? "",
    product: client_service_options[enquiry.client_service],
  }

  const user = await db.user.findFirst({ where: { email: data.email.toLowerCase() } })
  if (user) {
    await sendIntimationMailer({ to: user.email, product: data.product, name: data.name }).send()
  } else {
    await new Promise((resolve) => setTimeout(resolve, 750))
  }
  return data.email
})
