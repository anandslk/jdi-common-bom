import { config } from "src/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: config.smtp.SMTP_HOST,
  port: parseInt(config.smtp.SMTP_PORT!, 10),
  secure: false,

  auth: {
    user: config.smtp.SMTP_EMAIL,
    pass: config.smtp.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.SMTP_EMAIL,
      to: email,
      subject,
      html,
    });

    console.info("Message sent: %s", info.messageId);

    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    return error;
  }
};
