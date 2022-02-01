import nodemailer from 'nodemailer';

const createTransporter = ():nodemailer.Transporter => {
    let transporter:nodemailer.Transporter = nodemailer.createTransport({
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
        },
    });
    return transporter;
}
export default createTransporter;