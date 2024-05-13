import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { objErrors } from '../helpers';
import Project, { TProject } from '../models/Project';
import { ProjectErrorMsg } from '../data/ErrorMessages';

declare global {
	namespace Express {
		interface Request {
			project: TProject;
		}
	}
}

const validateProjectExists = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { projectId } = req.params;

		if (!Types.ObjectId.isValid(projectId)) {
			return res.status(400).json(
				objErrors({
					value: projectId,
					msg: ProjectErrorMsg.IsNotMongoId,
				}),
			);
		}
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json(objErrors({ value: projectId }));
		}
		req.project = project;
		next();
	} catch (err) {
		console.log({ err: err.message });
		res.status(500).json(
			objErrors({
				msg: 'Ocurrio un error',
				value: req.params.projectId,
			}),
		);
	}
};

export default validateProjectExists;
