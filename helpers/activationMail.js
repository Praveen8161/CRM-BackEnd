import nodemailer from "nodemailer";
import { backendURL } from "./urls.js";

// send password reset mail
export async function sendActivationMail(email, actToken, role) {
  let transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp:gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let details = {
    from: process.env.EMAIL_NAME,
    to: email,
    subject: "Confirmation Email ",
    html: `<h5>Hi there,</h5>
        <p>In order to complete your account creation click the link below to verify your email</p>
        <p>The link will be expired in 2 days</p>
        <div style="text-align: center;">
          <a href="${backendURL}/${role}/signup/activate/${actToken}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 15px;">
            Confirm Email
          </a>
        </div>`,
  };

  try {
    let res = await transport.sendMail(details);
    console.log(`Message sent: ${res.messageId}`);
    return res;
  } catch (err) {
    console.error({ error: err });
  }
}
