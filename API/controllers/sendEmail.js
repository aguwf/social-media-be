import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const { OAuth2 } = google.auth
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

let MAILING_SERVICE_CLIENT_ID
let MAILING_SERVICE_CLIENT_SECRET
let MAILING_SERVICE_REFRESH_TOKEN
let SENDER_EMAIL_ADDRESS

const oauth2Client = new OAuth2(
  (MAILING_SERVICE_CLIENT_ID = process.env.MAILING_SERVICE_CLIENT_ID),
  (MAILING_SERVICE_CLIENT_SECRET = process.env.MAILING_SERVICE_CLIENT_SECRET),
  (MAILING_SERVICE_REFRESH_TOKEN = process.env.MAILING_SERVICE_REFRESH_TOKEN),
  OAUTH_PLAYGROUND
)

const sendEmail = async (to, url, compiledTemplate) => {
  try {
    MAILING_SERVICE_CLIENT_ID = process.env.MAILING_SERVICE_CLIENT_ID
    MAILING_SERVICE_CLIENT_SECRET = process.env.MAILING_SERVICE_CLIENT_SECRET
    MAILING_SERVICE_REFRESH_TOKEN = process.env.MAILING_SERVICE_REFRESH_TOKEN
    SENDER_EMAIL_ADDRESS = process.env.SENDER_EMAIL_ADDRESS

    //   console.log(MAILING_SERVICE_CLIENT_ID, 1)
    //   console.log(MAILING_SERVICE_CLIENT_SECRET, 2)
    //   console.log(MAILING_SERVICE_REFRESH_TOKEN, 3)
    //   console.log(SENDER_EMAIL_ADDRESS, 4)

    oauth2Client.setCredentials({
      refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const access_token = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken: access_token
      }
    })

    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to: to,
      subject: `Meo's Network`,
      html: compiledTemplate.render({ url })
    }

    const info = await smtpTransport.sendMail(mailOptions).catch((error) => {
      console.log(error);
    })
    return info
  } catch (error) {
    // console.log(error)
  }
}

export default sendEmail
