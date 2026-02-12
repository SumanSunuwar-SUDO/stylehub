const { admin_email } = require("../utils/constant");
const { sendEmail } = require("../utils/sendEmail");

exports.contactUs = async (req, res) => {
  try {
    const { fname, lname, email, phone, subject, message } = req.body;

    const mailInfo = {
      from: `"StyleHub Contact Form" <${admin_email}>`, // sender
      to: admin_email, // recipient = admin
      subject: `New Contact Form Message from ${fname} ${lname} - ${subject}`,
      html: `
        <h2>You have received a new message from the StyleHub contact form:</h2>
        <p><strong>Name:</strong> ${fname} ${lname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject || "No subject"}</p>
        <p><strong>Message:</strong><br/><br/>${message}</p>
        <hr/>
        <p>Please respond to the user if necessary.</p>
      `,
    };

    await sendEmail(mailInfo);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
