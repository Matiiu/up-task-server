import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/authUtils';
import { createErrorSchema } from '../utils/errorUtils';

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
			await user.save();
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
