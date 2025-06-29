import nodemailer from "nodemailer";

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "hotmail", "yahoo" or SMTP config
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password (for Gmail, not account password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email failed");
  }
};


// EMAIL_USER=yourgmail@gmail.com
// EMAIL_PASS=your_app_password
// CONTACT_RECEIVER=receiver@example.com
