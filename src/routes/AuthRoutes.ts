import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/AuthController';
import handleInputErrors from '../middleware/validation';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/authConstants';

const router: Router = Router();

router.post(
	'/create-account',
	body('name').notEmpty().withMessage('El nombre es requerido'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres')
		.matches(PASSWORD_REGEX)
		.withMessage(
			'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
		),
	body('passwordConfirmation').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Las contraseñas no coinciden');
		}
		return true;
	}),
	body('email')
		.isEmail()
		.withMessage('El correo no es valido')
		.matches(EMAIL_REGEX)
		.withMessage('El correo no es valido'),
	handleInputErrors,
	AuthController.createAccount,
);

export default router;
