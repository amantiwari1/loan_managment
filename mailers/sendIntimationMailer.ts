import { apiInstance } from "integrations/sendinblue"
import SibApiV3Sdk from "sib-api-v3-sdk"

type ResetPasswordMailer = {
  to: string
  name: string
  product: string
}

export function sendIntimationMailer({ to, product, name }: ResetPasswordMailer) {
  const msg = {
    from: "info@kredpartner.com",
    to,
    subject: "Reminder to Upload documents - kredpartner.com",
    html: `
    <!DOCTYPE html>
    <html>
    <body>
    <p>Hello, ${name}</p>
    <p>Your enquiry for ${product} loan has been approved </p>
    <p>You are requested to upload the documents on the portal - 
    <a href="https://kredpartner.com" >Click here. <a> 
</body>
</html>
    `,
  }

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.subject = msg.subject
  sendSmtpEmail.htmlContent = msg.html
  sendSmtpEmail.sender = { email: msg.from, name: "Kredpartner" }
  sendSmtpEmail.to = [{ email: msg.to }]

  return {
    async send() {
      await apiInstance.sendTransacEmail(sendSmtpEmail).catch((err) => {
        console.error(err)
      })
    },
  }
}
