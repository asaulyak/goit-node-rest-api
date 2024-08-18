import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { MAIL_SEND_FROM, MAIL_TOKEN } = process.env;

const config = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_SEND_FROM,
    pass: MAIL_TOKEN
  }
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = options => {
  return transporter.sendMail({ from: MAIL_SEND_FROM, ...options });
};
