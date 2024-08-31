import { transporter } from '../config/nodemailer';
import { TToken } from '../models/Token';

type AuthEmailPayload = {
	email: string;
	token: TToken['token'];
	name: string;
};

class AuthEmail {
	static sendConfirmationEmail = async (
		payload: Pick<AuthEmailPayload, 'email' | 'token' | 'name'>,
	) => {
		const emailInfo = await transporter.sendMail({
			from: 'UpTask <admin@uptask.com>',
			to: payload.email,
			subject: 'UpTask - Confirma tu cuenta',
			text: 'Confirma tu cuenta',
			html: `
					<h1>Confirma tu cuenta</h1>
                    <p>Hola ${payload.name}, has creado tu cuenta en UpTask.</p>
					<p>Para confirmar tu cuenta da click en el siguiente enlace</p>
					<a href="${process.env.CONFIRM_ACCOUNT_URL}">Confirmar cuenta</a>
                    <p>E ingresa el código: <b>${payload.token}</b></p>
                    <p>Este token expira en 10 minutos</p>`,
		});

		console.log('Message sent: %s', emailInfo.messageId);
	};

	static sendRestorePasswordToken = async (
		payload: Pick<AuthEmailPayload, 'email' | 'token' | 'name'>,
	) => {
		const emailInfo = await transporter.sendMail({
			from: 'UpTask <admin@uptask.com>',
			to: payload.email,
			subject: 'UpTask - Restablecer contraseña',
			text: 'Restablece tu contraseña',
			html: `
					<h1>Confirma tu cuenta</h1>
                    <p>Hola ${payload.name}, has solicitado restablecer tu contraseña en UpTask.</p>
					<p>Para restablecer tu contraseña da click en el siguiente enlace</p>
					<a href="${process.env.RESTORE_PASSWORD_URL}">Restablecer contraseña</a>
                    <p>E ingresa el código: <b>${payload.token}</b></p>
                    <p>Este token expira en 10 minutos</p>`,
		});

		console.log('Message sent: %s', emailInfo.messageId);
	};
}

export default AuthEmail;
