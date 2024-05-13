import { Router } from 'express';
import { body, param } from 'express-validator';
import ProjectController from '../controllers/ProjectController';
import { ProjectErrorMsg, TaskErrorMsg } from '../data/ErrorMessages';
import handleInputErrors from '../middleware/validation';
import TaskController from '../controllers/TaskController';
import validateProjectExists from '../middleware/project';

const router: Router = Router();

router.post(
	'/',
	body('projectName')
		.notEmpty()
		.withMessage(ProjectErrorMsg.MissingProjectName),
	body('clientName').notEmpty().withMessage(ProjectErrorMsg.MissingClientName),
	body('description')
		.notEmpty()
		.withMessage(ProjectErrorMsg.MissingDescription),
	handleInputErrors,
	ProjectController.createProject,
);

router.get('/', ProjectController.getAllProjects);

router.get(
	'/:id',
	param('id').isMongoId().withMessage(ProjectErrorMsg.IsNotMongoId),
	handleInputErrors,
	ProjectController.getProjectById,
);

router.put(
	'/:id',
	param('id').isMongoId().withMessage(ProjectErrorMsg.IsNotMongoId),
	body('projectName')
		.notEmpty()
		.withMessage(ProjectErrorMsg.MissingProjectName),
	body('clientName').notEmpty().withMessage(ProjectErrorMsg.MissingClientName),
	body('description')
		.notEmpty()
		.withMessage(ProjectErrorMsg.MissingDescription),
	handleInputErrors,
	ProjectController.updateProject,
);

router.delete(
	'/:id',
	param('id').isMongoId().withMessage(ProjectErrorMsg.IsNotMongoId),
	handleInputErrors,
	ProjectController.deleteProject,
);

// Routes for tasks

// Add validateProjectExists function to all routes that include the param projectId
router.param('projectId', validateProjectExists);

router.post(
	'/:projectId/tasks',
	body('name').notEmpty().withMessage(TaskErrorMsg.MissingTaskName),
	body('description').notEmpty().withMessage(TaskErrorMsg.MissingDescription),
	handleInputErrors,
	TaskController.createTask,
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.get(
	'/:projectId/tasks/:taskId',
	param('taskId').isMongoId().withMessage(TaskErrorMsg.IsNotMongoId),
	handleInputErrors,
	TaskController.getTaskById,
);

export default router;
