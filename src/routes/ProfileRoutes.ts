import { Router } from 'express';
import { body } from 'express-validator';
import handleInputErrors from '../middleware/validation';
import { validateProjectExists } from '../middleware/project';
import { validateTaskExists, taskBelongsToProject } from '../middleware/task';
import { handleUserAuthentication, validateUser } from '../middleware/auth';
import ProfileController from '../controllers/ProfileControlles';
import { PASSWORD_REGEX } from '../constants/authConstant';

const router: Router = Router();

// This line adds middleware to the router that ensures the user is authenticated and validated before accessing any routes.
router.use(handleUserAuthentication, validateUser);

// Validates if a project with the given 'projectId' exists before proceeding to the route handler.
// It is executed whenever a route contains the 'projectId' parameter.
router.param('projectId', validateProjectExists);
// Validate that a task with the given 'taskId' exists before proceeding to the route handler
router.param('taskId', validateTaskExists);
// Check if the task with the given 'taskId' belongs to the current project before proceeding to the route handler
router.param('taskId', taskBelongsToProject);

router.put(
	'/',
	body('email').isEmail().withMessage('El correo no es valido'),
	body('name').notEmpty().withMessage('El nombre es requerido'),
	handleInputErrors,
	ProfileController.update,
);

router.post(
	'/password',
	body('currentPassword')
		.notEmpty()
		.withMessage('La contraseña actual es requerida'),
	body('newPassword')
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres')
		.matches(PASSWORD_REGEX)
		.withMessage(
			'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
		),
	body('passwordConfirmation').custom((value, { req }) => {
		if (value !== req.body.newPassword) {
			throw new Error('Las contraseñas no coinciden');
		}
		return true;
	}),
	handleInputErrors,
	ProfileController.updatePassword,
);

router.post(
	'/check-password',
	body('password').notEmpty().withMessage('La contraseña actual es requerida'),
	handleInputErrors,
	ProfileController.checkPassword,
);

export default router;
