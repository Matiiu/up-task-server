import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/authUtil';
import { createErrorSchema } from '../utils/errorUtil';
import { generateToken } from '../utils/tokenUtil';
import Token from '../models/Token';
import AuthEmail from '../emails/authEmail';

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
			const token = new Token();
			token.user = user._id;
			token.token = generateToken();

			AuthEmail.sendConfirmationEmail({
				email: user.email,
				name: user.name,
				token: token.token,
			});

			await Promise.allSettled([token.save(), user.save()]);
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

	static confirmAccount = async (req: Request, res: Response) => {
		try {
			const { token } = req.body;

			const foundToken = await Token.findOne({ token });
			if (!foundToken) {
				throw new Error('El token no es valido');
			}
			const user = await User.findById(foundToken.user);
			user.isConfirmed = true;
			await Promise.allSettled([user.save(), foundToken.deleteOne()]);
			res.send('La cuenta ha sido confirmada correctamente');
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
