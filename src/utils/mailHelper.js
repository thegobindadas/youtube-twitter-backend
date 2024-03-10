import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_MAIL_HOST,
  port: process.env.SMTP_MAIL_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports

  auth: {
    user: process.env.SMTP_MAIL_USERNAME,
    pass: process.env.SMTP_MAIL_PASSWORD,
  },
});



const mailHelper = async (option) => {

    const message = {
        from: process.env.SMTP_SENDER_EMAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(message)

}





export default mailHelper