const nodemailer = require("nodemailer");

let transporterInfo = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // note: user and pass must be genuine
    user: "tooesa600@gmail.com",
    pass: "jtjd rvns sczx fxfa",
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
