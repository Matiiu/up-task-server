import { Router } from 'express';
import { body } from 'express-validator';
import ProjectController from '../controllers/ProjectController';
import { ProjectErrorMsg, TaskErrorMsg } from '../data/MessagesAPI';
import handleInputErrors from '../middleware/validation';
import TaskController from '../controllers/TaskController';
import {
	validateProjectExists,
	validateUserPermissions,
} from '../middleware/project';
import {
	validateTaskExists,
	taskBelongsToProject,
	validTaskStatus,
	hasAuthorization,
} from '../middleware/task';
import { handleUserAuthentication, validateUser } from '../middleware/auth';
import NoteController from '../controllers/NoteController';

const router: Router = Router();

// This line adds middleware to the router that ensures the user is authenticated and validated before accessing any routes.
router.use(handleUserAuthentication, validateUser);

// This middleware function validates if a project with the given 'projectId' exists before proceeding to the route handler.
// It is executed whenever a route contains the 'projectId' parameter.
router.param('projectId', validateProjectExists);
// Middleware to validate that a task with the given 'taskId' exists before proceeding to the route handler
router.param('taskId', validateTaskExists);
// Middleware to check if the task with the given 'taskId' belongs to the current project before proceeding to the route handler
router.param('taskId', taskBelongsToProject);

router.post(
	'/:projectId/task/:taskId',
	body('content')
		.notEmpty()
		.withMessage('El contenido de la nota es requerido'),
	handleInputErrors,
	NoteController.create,
);

router.get('/:projectId/task/:taskId/notes', NoteController.getAll);

export default router;
