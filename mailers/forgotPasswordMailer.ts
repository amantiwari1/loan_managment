import { apiInstance } from "integrations/sendinblue"
import SibApiV3Sdk from "sib-api-v3-sdk"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/reset-password?token=${token}`

  const msg = {
    from: "info@kredpartner.com",
    to,
    subject: "Your Password Reset Instructions",
    html: renderHtml(resetUrl),
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

const renderHtml = (url: string) => {
  return `
  <!doctype html>
<html ⚡4email data-css-strict>

<head>
  <meta charset="utf-8">
  <style amp4email-boilerplate>
    body {
      visibility: hidden
    }
  </style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-custom>
    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
    }

    .es-button-border:hover a.es-button,
    .es-button-border:hover button.es-button {
      background: #FFFFFF;
      border-color: #FFFFFF;
    }

    .es-button-border:hover {
      background: #FFFFFF;
      border-style: solid solid solid solid;
      border-color: #3D5CA3 #3D5CA3 #3D5CA3 #3D5CA3;
    }

    s {
      text-decoration: line-through;
    }

    body {
      width: 100%;
      font-family: helvetica, "helvetica neue", arial, verdana, sans-serif;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0px;
    }

    table td,
    html,
    body,
    .es-wrapper {
      padding: 0;
      Margin: 0;
    }

    .es-content,
    .es-header,
    .es-footer {
      table-layout: fixed;
      width: 100%;
    }

    p,
    hr {
      Margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      Margin: 0;
      line-height: 120%;
      font-family: arial, "helvetica neue", helvetica, sans-serif;
    }

    .es-left {
      float: left;
    }

    .es-right {
      float: right;
    }

    .es-p5 {
      padding: 5px;
    }

    .es-p5t {
      padding-top: 5px;
    }

    .es-p5b {
      padding-bottom: 5px;
    }

    .es-p5l {
      padding-left: 5px;
    }

    .es-p5r {
      padding-right: 5px;
    }

    .es-p10 {
      padding: 10px;
    }

    .es-p10t {
      padding-top: 10px;
    }

    .es-p10b {
      padding-bottom: 10px;
    }

    .es-p10l {
      padding-left: 10px;
    }

    .es-p10r {
      padding-right: 10px;
    }

    .es-p15 {
      padding: 15px;
    }

    .es-p15t {
      padding-top: 15px;
    }

    .es-p15b {
      padding-bottom: 15px;
    }

    .es-p15l {
      padding-left: 15px;
    }

    .es-p15r {
      padding-right: 15px;
    }

    .es-p20 {
      padding: 20px;
    }

    .es-p20t {
      padding-top: 20px;
    }

    .es-p20b {
      padding-bottom: 20px;
    }

    .es-p20l {
      padding-left: 20px;
    }

    .es-p20r {
      padding-right: 20px;
    }

    .es-p25 {
      padding: 25px;
    }

    .es-p25t {
      padding-top: 25px;
    }

    .es-p25b {
      padding-bottom: 25px;
    }

    .es-p25l {
      padding-left: 25px;
    }

    .es-p25r {
      padding-right: 25px;
    }

    .es-p30 {
      padding: 30px;
    }

    .es-p30t {
      padding-top: 30px;
    }

    .es-p30b {
      padding-bottom: 30px;
    }

    .es-p30l {
      padding-left: 30px;
    }

    .es-p30r {
      padding-right: 30px;
    }

    .es-p35 {
      padding: 35px;
    }

    .es-p35t {
      padding-top: 35px;
    }

    .es-p35b {
      padding-bottom: 35px;
    }

    .es-p35l {
      padding-left: 35px;
    }

    .es-p35r {
      padding-right: 35px;
    }

    .es-p40 {
      padding: 40px;
    }

    .es-p40t {
      padding-top: 40px;
    }

    .es-p40b {
      padding-bottom: 40px;
    }

    .es-p40l {
      padding-left: 40px;
    }

    .es-p40r {
      padding-right: 40px;
    }

    .es-menu td {
      border: 0;
    }

    a {
      text-decoration: none;
    }

    p,
    ul li,
    ol li {
      font-family: helvetica, "helvetica neue", arial, verdana, sans-serif;
      line-height: 150%;
    }

    ul li,
    ol li {
      Margin-bottom: 15px;
      margin-left: 0;
    }

    .es-menu td a {
      text-decoration: none;
      display: block;
      font-family: helvetica, "helvetica neue", arial, verdana, sans-serif;
    }

    .es-menu amp-img,
    .es-button amp-img {
      vertical-align: middle;
    }

    .es-wrapper {
      width: 100%;
      height: 100%;
    }

    .es-wrapper-color {
      background-color: #FAFAFA;
    }

    .es-header {
      background-color: transparent;
    }

    .es-header-body {
      background-color: #FFFFFF;
    }

    .es-header-body p,
    .es-header-body ul li,
    .es-header-body ol li {
      color: #333333;
      font-size: 14px;
    }

    .es-header-body a {
      color: #1376C8;
      font-size: 14px;
    }

    .es-content-body {
      background-color: #FFFFFF;
    }

    .es-content-body p,
    .es-content-body ul li,
    .es-content-body ol li {
      color: #666666;
      font-size: 16px;
    }

    .es-content-body a {
      color: #0B5394;
      font-size: 16px;
    }

    .es-footer {
      background-color: transparent;
    }

    .es-footer-body {
      background-color: transparent;
    }

    .es-footer-body p,
    .es-footer-body ul li,
    .es-footer-body ol li {
      color: #333333;
      font-size: 14px;
    }

    .es-footer-body a {
      color: #333333;
      font-size: 14px;
    }

    .es-infoblock,
    .es-infoblock p,
    .es-infoblock ul li,
    .es-infoblock ol li {
      line-height: 120%;
      font-size: 12px;
      color: #CCCCCC;
    }

    .es-infoblock a {
      font-size: 12px;
      color: #CCCCCC;
    }

    h1 {
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      color: #333333;
    }

    h2 {
      font-size: 14px;
      font-style: normal;
      font-weight: normal;
      color: #333333;
    }

    h3 {
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      color: #333333;
    }

    .es-header-body h1 a,
    .es-content-body h1 a,
    .es-footer-body h1 a {
      font-size: 20px;
    }

    .es-header-body h2 a,
    .es-content-body h2 a,
    .es-footer-body h2 a {
      font-size: 14px;
    }

    .es-header-body h3 a,
    .es-content-body h3 a,
    .es-footer-body h3 a {
      font-size: 20px;
    }

    a.es-button,
    button.es-button {
      border-style: solid;
      border-color: #FFFFFF;
      border-width: 15px 20px 15px 20px;
      display: inline-block;
      background: #FFFFFF;
      border-radius: 10px;
      font-size: 14px;
      font-family: arial, "helvetica neue", helvetica, sans-serif;
      font-weight: bold;
      font-style: normal;
      line-height: 120%;
      color: #3D5CA3;
      text-decoration: none;
      width: auto;
      text-align: center;
    }

    .es-button-border {
      border-style: solid solid solid solid;
      border-color: #3D5CA3 #3D5CA3 #3D5CA3 #3D5CA3;
      background: #FFFFFF;
      border-width: 2px 2px 2px 2px;
      display: inline-block;
      border-radius: 10px;
      width: auto;
    }

    @media only screen and (max-width:600px) {

      p,
      ul li,
      ol li,
      a {
        line-height: 150%
      }

      h1,
      h2,
      h3,
      h1 a,
      h2 a,
      h3 a {
        line-height: 120%
      }

      h1 {
        font-size: 20px;
        text-align: center
      }

      h2 {
        font-size: 16px;
        text-align: left
      }

      h3 {
        font-size: 20px;
        text-align: center
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 20px
      }

      h2 a {
        text-align: left
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 16px
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px
      }

      .es-menu td a {
        font-size: 14px
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li,
      .es-header-body a {
        font-size: 10px
      }

      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li,
      .es-content-body a {
        font-size: 16px
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li,
      .es-footer-body a {
        font-size: 12px
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li,
      .es-infoblock a {
        font-size: 12px
      }

      *[class="gmail-fix"] {
        display: none
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3 {
        text-align: center
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3 {
        text-align: right
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3 {
        text-align: left
      }

      .es-m-txt-r amp-img {
        float: right
      }

      .es-m-txt-c amp-img {
        margin: 0 auto
      }

      .es-m-txt-l amp-img {
        float: left
      }

      .es-button-border {
        display: block
      }

      a.es-button,
      button.es-button {
        font-size: 14px;
        display: block;
        border-left-width: 0px;
        border-right-width: 0px
      }

      .es-btn-fw {
        border-width: 10px 0px;
        text-align: center
      }

      .es-adaptive table,
      .es-btn-fw,
      .es-btn-fw-brdr,
      .es-left,
      .es-right {
        width: 100%
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100%;
        max-width: 600px
      }

      .es-adapt-td {
        display: block;
        width: 100%
      }

      .adapt-img {
        width: 100%;
        height: auto
      }

      td.es-m-p0 {
        padding: 0px
      }

      td.es-m-p0r {
        padding-right: 0px
      }

      td.es-m-p0l {
        padding-left: 0px
      }

      td.es-m-p0t {
        padding-top: 0px
      }

      td.es-m-p0b {
        padding-bottom: 0
      }

      td.es-m-p20b {
        padding-bottom: 20px
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none
      }

      tr.es-desk-hidden,
      td.es-desk-hidden,
      table.es-desk-hidden {
        width: auto;
        overflow: visible;
        float: none;
        max-height: inherit;
        line-height: inherit
      }

      tr.es-desk-hidden {
        display: table-row
      }

      table.es-desk-hidden {
        display: table
      }

      td.es-desk-menu-hidden {
        display: table-cell
      }

      .es-menu td {
        width: 1%
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto
      }

      table.es-social {
        display: inline-block
      }

      table.es-social td {
        display: inline-block
      }
    }
  </style>
</head>

<body>
  <div class="es-wrapper-color">
    <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td valign="top">
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td style="background-color: #fafafa" bgcolor="#fafafa" align="center">
                <table class="es-content-body" style="background-color: #ffffff" width="600" cellspacing="0"
                  cellpadding="0" bgcolor="#ffffff" align="center">
                  <tr>
                    <td class="es-p40t es-p20r es-p20l"
                      style="background-color: transparent;background-position: left top" bgcolor="transparent"
                      align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="560" valign="top" align="center">
                            <table style="background-position: left top" width="100%" cellspacing="0" cellpadding="0"
                              role="presentation">
                              <tr>
                                <td class="es-p5t es-p5b" align="center" style="font-size:0">
                                  <amp-img
                                    src="https://tmzcud.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png"
                                    alt style="display: block" width="175" height="208"></amp-img>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p15t es-p15b" align="center">
                                  <h1 style="color: #333333;font-size: 20px"><strong>FORGOT YOUR </strong></h1>
                                  <h1 style="color: #333333;font-size: 20px"><strong>&nbsp;PASSWORD?</strong></h1>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p35r es-p40l" align="left">
                                  <p style="text-align: center">There was a request to change your password!</p>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p25t es-p40r es-p40l" align="center">
                                  <p>If did not make this request, just ignore this email. Otherwise, please click the
                                    button below to change your password:</p>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p40t es-p40b es-p10r es-p10l" align="center"><span
                                    class="es-button-border"><a href="${url}" class="es-button"
                                      target="_blank">RESET PASSWORD</a></span></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td style="background-color: #fafafa" bgcolor="#fafafa" align="center">
                <table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0"
                  cellpadding="0" bgcolor="transparent" align="center">
                  <tr>
                    <td class="es-p15t" style="background-position: left top" align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="600" valign="top" align="center">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-p20b es-p20r es-p20l" align="center" style="font-size:0">
                                  <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                    <tr>
                                      <td
                                        style="border-bottom: 1px solid #fafafa;background: none;height: 1px;width: 100%;margin: 0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>
  
  
  
  `
}
