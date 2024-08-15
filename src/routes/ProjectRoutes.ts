import { Router } from 'express';
import { body } from 'express-validator';
import ProjectController from '../controllers/ProjectController';
import { ProjectErrorMsg, TaskErrorMsg } from '../data/MessagesAPI';
import handleInputErrors from '../middleware/validation';
import TaskController from '../controllers/TaskController';
import { productNotFound, validateProjectExists } from '../middleware/project';
import {
	validateTaskExists,
	taskBelongsToProject,
	validTaskStatus,
} from '../middleware/task';

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

router.param('id', productNotFound);

router.get('/:id', ProjectController.getProjectById);

router.put(
	'/:id',
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

router.delete('/:id', ProjectController.deleteProject);

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

// Validate if the task exists in the project
router.param('taskId', validateTaskExists);
router.param('taskId', taskBelongsToProject);

router.get('/:projectId/tasks/:taskId', TaskController.getTaskById);

router.put(
	'/:projectId/tasks/:taskId',
	body('name').notEmpty().withMessage(TaskErrorMsg.MissingTaskName),
	body('description').notEmpty().withMessage(TaskErrorMsg.MissingDescription),
	handleInputErrors,
	TaskController.updateTask,
);

router.delete('/:projectId/tasks/:taskId', TaskController.deleteTask);

router.post(
	'/:projectId/tasks/:taskId/status',
	body('status').notEmpty().withMessage(TaskErrorMsg.MandatoryStatus),
	handleInputErrors,
	validTaskStatus,
	TaskController.updateStatus,
);

export default router;
