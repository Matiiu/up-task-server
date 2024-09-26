import { Request, Response } from 'express';
import User, { TUser } from '../models/User';
import { hashPassword, validatePassword } from '../utils/authUtil';
import { createErrorSchema } from '../utils/errorUtil';
import { generateToken } from '../utils/tokenUtil';
import Token from '../models/Token';
import AuthEmail from '../emails/AuthEmail';
import { generateJSONWebToken } from '../utils/jwt';

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
				user,
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
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error('El usuario no esta registrado');
			}
			if (!user.isConfirmed) {
				const token = await AuthController.createToken(user);
				AuthEmail.sendConfirmationEmail({
					user,
					token: token.token,
				});
				throw new Error(
					'La cuenta no ha sido confirmada, te hemos enviado un correo de confirmación a tu dirección de correo electrónico',
				);
			}
			const isPasswordValid = await validatePassword(password, user.password);
			if (!isPasswordValid) {
				throw new Error('La contraseña es incorrecta');
			}
			const token = generateJSONWebToken({ id: user.id });
			res.send({ token });
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
				user,
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
		try {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error('El usuario no esta registrado');
			}

			// Create a token for the user
			const token = await AuthController.createToken(user);

			AuthEmail.sendRestorePasswordToken({
				user,
				token: token.token,
			});
			res.send(
				'Se ha enviado un correo con un token para restablecer tu contraseña',
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

	static validateToken = async (req: Request, res: Response) => {
		const { token } = req.body;
		try {
			const foundToken = await Token.findOne({ token });
			if (!foundToken) {
				throw new Error('El token no es valido o ha expirado');
			}
			res.send('El token es valido, define una nueva contraseña');
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

	static createNewPasswordByToken = async (req: Request, res: Response) => {
		try {
			const { token } = req.params;
			const { password } = req.body;

			const foundToken = await Token.findOne({ token });
			if (!foundToken) {
				throw new Error('El token no es valido o ha expirado');
			}
			const user = await User.findById(foundToken.user);
			user.password = await hashPassword(password);
			await Promise.allSettled([user.save(), foundToken.deleteOne()]);

			res.send('La contraseña ha sido actualizada correctamente');
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

	static getAuthenticatedUser = (req: Request, res: Response) => {
		return res.json(req.authenticatedUser);
	};

	private static createToken = async (user: TUser) => {
		const token = new Token();
		await this.deleteTokensByUserId(user.id);

		token.user = user.id;
		token.token = generateToken();
		await token.save();
		return token;
	};

	private static deleteTokensByUserId = async (userId: TUser['id']) => {
		await Token.deleteMany({ user: userId });
	};
}

export default AuthController;
