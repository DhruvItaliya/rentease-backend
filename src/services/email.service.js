// mailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,  // your Gmail address
    pass: process.env.PASS_KEY     // app password or env secret
  }
});

const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Email sent', response: info.response };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: 'Email failed', error };
  }
};

export default sendMail;
