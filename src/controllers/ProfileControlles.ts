import { Request, Response } from 'express';
import type { TUser } from '../models/User';
import colors from 'colors';
import User from '../models/User';
import type { UpdatePassword } from '../types/profile';
import { hashPassword, validatePassword } from '../utils/authUtil';

export default class ProfileController {
	static update = async (req: Request<{}, {}, TUser>, res: Response) => {
		const { name, email } = req.body;

		const userExists = await User.findOne({ email });

		if (userExists && userExists.id.toString() !== req.user.id.toString()) {
			return res.status(400).json({ message: 'El correo ya esta en uso' });
		}

		req.user.name = name;
		req.user.email = email;

		try {
			await req.user.save();
			res.send('Usuario actualizado correctamente');
		} catch (error) {
			console.log(
				colors.bgRed.bold(
					'An error occurred while updating the user:\n' + error?.message ||
						error,
				),
			);
			res.status(500).json({ message: 'Error inesperado' });
		}
	};

	static updatePassword = async (
		req: Request<{}, {}, UpdatePassword>,
		res: Response,
	) => {
		const { currentPassword, newPassword, passwordConfirmation } = req.body;

		// Check if the current password is correct
		const user = await User.findById(req.user.id);
		const isPasswordValid = await validatePassword(
			currentPassword,
			user.password,
		);

		if (!isPasswordValid) {
			return res
				.status(400)
				.json({ message: 'La contraseña actual es incorrecta' });
		}
		if (newPassword !== passwordConfirmation) {
			return res.status(400).json({ message: 'Las contraseñas no coinciden' });
		}

		// Update the password
		try {
			user.password = await hashPassword(newPassword);
			await user.save();
			res.send('Contraseña actualizada correctamente');
		} catch (error) {
			console.log(
				colors.bgRed.bold(
					'An error occurred while updating the password:\n' + error?.message ||
						error,
				),
			);
			res.status(500).json({ message: 'Error inesperado' });
		}
	};
}
