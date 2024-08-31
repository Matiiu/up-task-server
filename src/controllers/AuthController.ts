import { Request, Response } from 'express';
import User, { TUser } from '../models/User';
import { hashPassword, validatePassword } from '../utils/authUtil';
import { createErrorSchema } from '../utils/errorUtil';
import { generateToken } from '../utils/tokenUtil';
import Token from '../models/Token';
import AuthEmail from '../emails/AuthEmail';

class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			const foundEmail = await User.findOne({ email });
			if (foundEmail) {
				throw new Error('El correo ya esta en uso');
			}
			const user = new User(req.body);
			user.password = await hashPassword(password);

			// Create a token for the user
			const token = await AuthController.createToken(user);

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
				throw new Error('El token no es valido o ha expirado');
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

	static login = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;
			const foundUser = await User.findOne({ email });
			if (!foundUser) {
				throw new Error('Usuario no encontrado');
			}
			if (!foundUser.isConfirmed) {
				const token = await AuthController.createToken(foundUser);
				AuthEmail.sendConfirmationEmail({
					email: foundUser.email,
					name: foundUser.name,
					token: token.token,
				});
				throw new Error(
					'La cuenta no ha sido confirmada, te hemos enviado un correo de confirmación a tu dirección de correo electrónico',
				);
			}
			const isPasswordValid = await validatePassword(
				password,
				foundUser.password,
			);
			if (!isPasswordValid) {
				throw new Error('La contraseña es incorrecta');
			}
			res.send('Autenticado correctamente');
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

	static requestConfirmationToken = async (req: Request, res: Response) => {
		try {
			const { email } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				throw new Error('El usuario no esta registrado');
			}
			if (user.isConfirmed) {
				throw new Error('La cuenta ya ha sido confirmada');
			}

			// Create a token for the user
			const token = await AuthController.createToken(user);

			AuthEmail.sendConfirmationEmail({
				email: user.email,
				name: user.name,
				token: token.token,
			});

			await Promise.allSettled([token.save(), user.save()]);
			res.send(
				'Se ha enviado un código de confirmación a tu dirección de correo electrónico',
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

	static restorePassword = async (req: Request, res: Response) => {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('El usuario no esta registrado');
		}

		// Create a token for the user
		const token = await AuthController.createToken(user);

		AuthEmail.sendRestorePasswordToken({
			email: user.email,
			name: user.name,
			token: token.token,
		});
		res.send(
			'Se ha enviado un correo con un token para restablecer tu contraseña',
		);
	};

	private static createToken = async (user: TUser) => {
		const token = new Token();
		await Token.deleteMany({ user: user._id });

		token.user = user._id;
		token.token = generateToken();
		await token.save();
		return token;
	};
}

export default AuthController;
