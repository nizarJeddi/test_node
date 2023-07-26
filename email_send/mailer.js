const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configuration du transporter Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fonction pour envoyer un e-mail
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès: " + info.response);
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
