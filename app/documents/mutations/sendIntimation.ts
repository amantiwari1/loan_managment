import { resolver } from "blitz"
import db from "db"
import { sendIntimationMailer } from "mailers/sendIntimationMailer"

export default resolver.pipe(async ({ email, product, name }) => {
  const user = await db.user.findFirst({ where: { email: email.toLowerCase() } })
  if (user) {
    await sendIntimationMailer({ to: user.email, product, name }).send()
  } else {
    await new Promise((resolve) => setTimeout(resolve, 750))
  }
  return
})
