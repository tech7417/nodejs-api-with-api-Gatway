const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
function genratesToken(data) {
    const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    if (token) {
        return token
    }
    return false
}

async function verifyjwtToken(token, secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject({ status: 401, message: "Failed to authenticate token." });
            } else {
                resolve(decoded);
            }
        });

    })
}

/**
 * Generates a random OTP.
 * @returns {string} - The generated OTP.
 */
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
/**
 * Sends an OTP email to the user.
 * @param {string} email - The user's email address.
 * @param {string} otp - The OTP to send.
 * @returns {Promise<void>}
 */
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
 service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
        auth: {
            user: 'u9107730@gmail.com',
            pass: 'onfv gfnn mmsq iihu',
        },
    });

    const mailOptions = {
        from: "u9107730@gmail.com",
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
         console.log(error);
    }
   
};



module.exports = { genratesToken, verifyjwtToken , generateOtp, sendOtpEmail}