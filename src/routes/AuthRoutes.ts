import { Router, request } from 'express';
import { body, param } from 'express-validator';
import AuthController from '../controllers/AuthController';
import handleInputErrors from '../middleware/validation';
import { PASSWORD_REGEX } from '../constants/authConstant';
import { handleUserAuthentication, validateUser } from '../middleware/auth';

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

router.post(
	'/request-token',
	body('email').isEmail().withMessage('El correo no es valido'),
	handleInputErrors,
	AuthController.requestConfirmationToken,
);

router.post(
	'/restore-password',
	body('email').isEmail().withMessage('El correo no es valido'),
	handleInputErrors,
	AuthController.restorePassword,
);

router.post(
	'/validate-token',
	body('token').notEmpty().withMessage('El token es requerido'),
	handleInputErrors,
	AuthController.validateToken,
);

router.post(
	'/new-password/:token',
	param('token').notEmpty().withMessage('El token es requerido'),
	body('password')
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres'),
	body('password')
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
	handleInputErrors,
	AuthController.createNewPasswordByToken,
);

router.get(
	'/user',
	handleUserAuthentication,
	validateUser,
	AuthController.getAuthenticatedUser,
);

export default router;
