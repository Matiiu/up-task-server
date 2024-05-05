import { Request, Response, NextFunction } from 'express';
import { objErrors } from '../helpers';
import Project, { TProject } from '../models/Project';

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
	next: NextFunction
) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json(objErrors({ value: projectId }));
		}
		req.project = project;
		next();
	} catch (err) {
		res.status(500).json(objErrors({ msg: 'Ocurrio un error' }));
	}
};

export default validateProjectExists;
