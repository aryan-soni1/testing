const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  port: 587,
  secure: false,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PSWD,
  },
});

const mailSender = async (email,title, body) => {
  try {
    // Create a Transporter to send emails
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
module.exports = mailSender;
