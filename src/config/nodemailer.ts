import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function createSMTPConfig() {
	return {
		host: process.env.SMTP_HOST,
		port: +process.env.SMTP_PORT,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	};
}

export const transporter = nodemailer.createTransport(createSMTPConfig());
