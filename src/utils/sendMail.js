"use strict";
import nodemailer from "nodemailer";
import {env} from "../configs/environment.js"

const transporter = nodemailer.createTransport({
    service: 'gmail',
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: env.EMAIL_NAME,
    pass: env.EMAIL_APP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(html,toEmail) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Roll Sneaker" ${env.EMAIL_NAME}`, // sender address
    to: `${toEmail}`, // list of receivers
    subject: "Xin chào quý khách!", // Subject line
    text: "", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}
export default main