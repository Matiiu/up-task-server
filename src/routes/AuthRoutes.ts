import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/AuthController';
import handleInputErrors from '../middleware/validation';
import { PASSWORD_REGEX } from '../constants/authConstant';

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
	body('email').isEmail().withMessage('El correo no es valido'),
	handleInputErrors,
	AuthController.createAccount,
);

router.post(
	'/confirm-account',
	body('token').notEmpty().withMessage('El token es requerido'),
	handleInputErrors,
	AuthController.confirmAccount,
);

router.post(
	'/login',
	body('email').isEmail().withMessage('El correo no es valido'),
	body('password').notEmpty().withMessage('La contraseña es requerida'),
	handleInputErrors,
	AuthController.login,
);

export default router;
