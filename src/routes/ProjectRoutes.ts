import { Router } from 'express';
import { body, param } from 'express-validator';
import ProjectController from '../controllers/ProjectController';
import { ProductErrorMsg } from '../data/ErrorMessages';
import handleInputErrors from '../middleware/validation';

const router: Router = Router();

router.post(
	'/',
	body('projectName')
		.notEmpty()
		.withMessage(ProductErrorMsg.MissingProjectName),
	body('clientName').notEmpty().withMessage(ProductErrorMsg.MissingClientName),
	body('description')
		.notEmpty()
		.withMessage(ProductErrorMsg.MissingDescription),
	handleInputErrors,
	ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get(
	'/:id',
	param('id').isMongoId().withMessage(ProductErrorMsg.IsNotMongoId),
	handleInputErrors,
	ProjectController.getProjectById
);

router.put(
	'/:id',
	param('id').isMongoId().withMessage(ProductErrorMsg.IsNotMongoId),
	body('projectName')
		.notEmpty()
		.withMessage(ProductErrorMsg.MissingProjectName),
	body('clientName').notEmpty().withMessage(ProductErrorMsg.MissingClientName),
	body('description')
		.notEmpty()
		.withMessage(ProductErrorMsg.MissingDescription),
	handleInputErrors,
	ProjectController.updateProject
);

router.delete(
	'/:id',
	param('id').isMongoId().withMessage(ProductErrorMsg.IsNotMongoId),
	handleInputErrors,
	ProjectController.deleteProject
);

export default router;
