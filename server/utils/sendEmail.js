const nodemailer = require("nodemailer");
const { admin_email, email_pass } = require("./constant");

let transporterInfo = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // note: user and pass must be genuine
    user: admin_email,
    pass: email_pass,
  },
};

exports.sendEmail = async (mailInfo) => {
  try {
    let transporter = nodemailer.createTransport(transporterInfo);
    let info = await transporter.sendMail(mailInfo);
  } catch (error) {
    console.log("error is occured", error.message);
  }
};
