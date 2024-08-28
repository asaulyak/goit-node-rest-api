import { sendEmail } from '../email/email.service.js';

export function sendVerificationEmail(user) {
  const { email, verificationToken } = user;
  const verificationLink = `http://localhost:3000/api/auth/verify/${verificationToken}`;

  return sendEmail({
    to: email,
    subject: 'Email verification',
    html: `<h1>Email verification</h1>
            <p>Please verify your email by following the <a href="${verificationLink}">verification link</a></p>
            <p>or copy and paste it in your browser search bar ${verificationLink}</p>
`
  });
}
