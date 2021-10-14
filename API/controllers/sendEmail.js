/** @format */

import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

// let MAILING_SERVICE_CLIENT_ID
// let MAILING_SERVICE_CLIENT_SECRET
// let MAILING_SERVICE_REFRESH_TOKEN
// let SENDER_EMAIL_ADDRESS

// const oauth2Client = new OAuth2(
//   (MAILING_SERVICE_CLIENT_ID = process.env.MAILING_SERVICE_CLIENT_ID),
//   (MAILING_SERVICE_CLIENT_SECRET = process.env.MAILING_SERVICE_CLIENT_SECRET),
//   (MAILING_SERVICE_REFRESH_TOKEN = process.env.MAILING_SERVICE_REFRESH_TOKEN),
//   OAUTH_PLAYGROUND
// )

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.MAILING_SERVICE_CLIENT_ID,
    process.env.MAILING_SERVICE_CLIENT_SECRET,
    OAUTH_PLAYGROUND,
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject('Failed to create access token :(');
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SENDER_EMAIL_ADDRESS,
      accessToken,
      clientId: process.env.MAILING_SERVICE_CLIENT_ID,
      clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (to, url, compiledTemplate) => {
  try {
    const emailOptions = {
      from: process.env.SENDER_EMAIL_ADDRESS,
      to: to,
      subject: `Meo's Network`,
      html: compiledTemplate.render({ url }),
    };

    let emailTransporter = await createTransporter();
    const info = await emailTransporter.sendMail(emailOptions);
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default sendEmail;
