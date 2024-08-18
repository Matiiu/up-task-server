import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/authUtils';
import { createErrorSchema } from '../utils/errorUtils';
import { generateToken } from '../utils/tokenUtils';
import Token from '../models/Token';
import { transporter } from '../config/nodemailer';

class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			const isExistingEmail = await User.findOne({ email });
			if (isExistingEmail) {
				throw new Error('El correo ya esta en uso');
			}
			const user = new User(req.body);
			user.password = await hashPassword(password);

			// Create a token for the user
			const toke = new Token();
			toke.user = user._id;
			toke.token = generateToken();

			await transporter.sendMail({
				from: 'UpTask <admin@uptask.com>',
				to: user.email,
				subject: 'Confirma tu cuenta',
				html: `
					<h1>Confirma tu cuenta</h1>
					<p>Para confirmar tu cuenta da click en el siguiente enlace</p>
					<a href="http://localhost:3000/confirmar-cuenta/${toke.token}">Confirmar cuenta</a>`,
			});

			await Promise.allSettled([toke.save(), user.save()]);
			res.send(
				'Se ha creado la cuenta correctamente, te hemos enviado un correo de confirmación a tu dirección de correo electrónico para que confirmes tu cuenta',
			);
		} catch (error) {
			res.status(500).json(
				createErrorSchema({
					msg: error.message,
					path: error.path,
					value: error.value,
				}),
			);
		}
	};
}

export default AuthController;
