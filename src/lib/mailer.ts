import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER as string, // .env에서 로드
    pass: process.env.EMAIL_PASS as string, // .env에서 로드
  },
});

export default transporter;
