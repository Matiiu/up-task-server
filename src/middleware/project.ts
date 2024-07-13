import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { objErrors } from '../utils';
import Project, { TProject } from '../models/Project';
import { ProjectErrorMsg } from '../data/MessagesAPI';

declare global {
	namespace Express {
		interface Request {
			project: TProject;
		}
	}
}

export async function productNotFound(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { id } = req.params;

		if (!Types.ObjectId.isValid(id)) {
			return res.status(400).json(
				objErrors({
					value: id,
					msg: ProjectErrorMsg.IsNotMongoId,
				}),
			);
		}
		const project = await Project.findById(req.params.id).populate('tasks');

		if (!project) {
			return res.status(404).json(objErrors({ value: req.params.id }));
		}
		req.project = project;
		next();
	} catch (err) {
		res.status(500).json(
			objErrors({
				msg: 'Ocurrio un error',
				value: req.params.projectId,
			}),
		);
	}
}

export async function validateProjectExists(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { projectId } = req.params;

		if (!Types.ObjectId.isValid(projectId)) {
			return res.status(400).json(
				objErrors({
					value: projectId,
					msg: ProjectErrorMsg.IsNotMongoId,
					path: 'projectId',
				}),
			);
		}
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json(
				objErrors({
					value: projectId,
					path: 'projectId',
				}),
			);
		}
		req.project = project;
		next();
	} catch (err) {
		res.status(500).json(
			objErrors({
				msg: 'Ocurrio un error',
				value: req.params.projectId,
			}),
		);
	}
}
