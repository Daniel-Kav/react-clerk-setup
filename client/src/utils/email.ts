import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { HTTPException } from 'hono/http-exception';

dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.ZOHO_EMAIL_USER,
    pass: process.env.ZOHO_EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: process.env.ZOHO_EMAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new HTTPException(500, { message: 'Unable to send email' });
  }
};


export const sendVerificationEmail = async (to: string, token: string) => {
  validateEmailAndToken(to, token);
  const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email?token=${token}`;
  const html = `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`;
  await sendEmail(to, 'Verify Your Email', html);
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  validateEmailAndToken(to, token);
  const resetUrl = `${process.env.BASE_URL}/api/v1/reset-password/confirm?token=${token}`;
  const html = `<p>To reset your password, click <a href="${resetUrl}">here</a>.</p>`;
  await sendEmail(to, 'Password Reset', html);
};

export const sendStudentVerificationEmail = async (to: string, token: string) => {
  validateEmailAndToken(to, token);
  const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-student?token=${token}`;
  const html = `<p>Please verify your student status by clicking <a href="${verificationUrl}">here</a>.</p>`;
  await sendEmail(to, 'Verify Your Student Status', html);
}


const validateEmailAndToken = (email: string, token: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new HTTPException(400, { message: 'Invalid email format' });
  }

  const tokenRegex = /^[A-Za-z0-9_-]{43}$/;
  if (!tokenRegex.test(token)) {
    throw new HTTPException(400, { message: 'Invalid token format' });
  }
};