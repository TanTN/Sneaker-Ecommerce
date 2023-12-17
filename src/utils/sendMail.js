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
}
export default main