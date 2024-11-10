import dotenv from 'dotenv'
dotenv.config();
// src/emailService.js
export const sendEmail = (emailData) => {
    return window.Email.send({
      Host: "smtp.gmail.com",
      Username: process.env.REACT_APP_SMTP_USERNAME, // Replace with your SMTP username
      Password: process.env.REACT_APP_SMTP_PASSWORD, // Replace with your SMTP password
      To: emailData.to,
      From: emailData.from,
      Subject: emailData.subject,
      Body: emailData.body,
    });
  };
  