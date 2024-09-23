import { Router } from 'express';
import { body } from 'express-validator';
import TeamController from '../controllers/TeamController';
import { validateProjectExists } from '../middleware/project';
import handleInputErrors from '../middleware/validation';
import { handleUserAuthentication, validateUser } from '../middleware/auth';

const router: Router = Router();

// Add handleUserAuthentication and validateUser functions to all routes
router.use(handleUserAuthentication, validateUser);

// Add validateProjectExists function to all routes that include the param projectId
router.param('projectId', validateProjectExists);

router.post(
	'/:projectId',
	body('userId').isMongoId().withMessage('El ID del usuario no es valido'),
	handleInputErrors,
	TeamController.addMemberByUserId,
);

router.get('/:projectId', TeamController.getTeam);

router.post(
	'/:projectId/find',
	body('email').isEmail().toLowerCase().withMessage('El correo no es valido'),
	handleInputErrors,
	TeamController.findMemberByEmail,
);

router.delete(
	'/:projectId',
	body('userId').isMongoId().withMessage('El ID del usuario no es valido'),
	handleInputErrors,
	TeamController.removeMemberByUserId,
);

export default router;
