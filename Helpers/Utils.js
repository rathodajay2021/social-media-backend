const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const createJsonToken = (id) => {
  return jwt.sign({ id }, global.secretKey, { expiresIn: global.tokenAge });
};

const sendMail = async (emailId, subject, message, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.senderEmailId,
      pass: process.env.senderEmailPass,
    },
  });

  const mailInfo = await transporter.sendMail({
    from: process.env.senderEmailId,
    to: `${emailId}`,
    subject: subject || "email testing",
    text: message || "yeeepp! it worked",
    html: html,
  });

  return mailInfo;
};

const otpGeneration = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

module.exports = {
  createJsonToken,
  sendMail,
  otpGeneration
};
