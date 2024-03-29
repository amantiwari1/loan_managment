import { apiInstance } from "integrations/sendinblue"
import SibApiV3Sdk from "sib-api-v3-sdk"

type ResetPasswordMailer = {
  to: string
  name: string
  url: string
}

export function InviteUserMailerV1({ to, name, url }: ResetPasswordMailer) {
  const msg = {
    from: "info@kredpartner.com",
    to,
    subject: "Welcome to Kredpartner - kredpartner.com",
    html: `
    <!DOCTYPE html>
    <html>
    <body>
    <p>Dear, ${name}</p>
    <p>Here's the link to set your password </p>
    <a href="${url}" >Click here. <a> 
 
    <p>Thanks and Regards,</p>
<p>Kredpartner</p>
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
