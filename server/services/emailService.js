// server/services/emailServices.js

const nodemailer = require('nodemailer');

const sendVerificationEmail = async (user, req) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/user/verify/${user.verificationToken}`; 

    return transporter.sendMail({
        from: '"Lunar Praxis" <no-reply@lunarpraxis.com>',
        to: user.email,
        subject: 'Please verify your email address',
        html: `<p>Thank you for registering with lunar praxis! Please click the following link to verify your email address:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });
};

module.exports = { sendVerificationEmail };
