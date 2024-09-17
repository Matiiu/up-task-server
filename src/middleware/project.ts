import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { createErrorSchema } from '../utils/errorUtil';
import Project, { TProject } from '../models/Project';
import { ProjectErrorMsg } from '../data/MessagesAPI';

declare global {
	namespace Express {
		interface Request {
			project: TProject;
		}
	}
}

export async function projectNotFound(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { id } = req.params;

		if (!Types.ObjectId.isValid(id)) {
			return res.status(400).json(
				createErrorSchema({
					value: id,
					msg: ProjectErrorMsg.IsNotMongoId,
				}),
			);
		}
		const project = await Project.findById(req.params.id).populate('tasks');

		if (!project) {
			return res.status(404).json(createErrorSchema({ value: req.params.id }));
		}

		console.log('project.manager', project.manager);
		console.log('req.safeUser.id', req.safeUser.id);
		if (project.manager.toString() !== req.safeUser.id.toString()) {
			return res.status(403).json(
				createErrorSchema({
					msg: 'No tienes permisos para acceder a este proyecto',
					value: id,
				}),
			);
		}
		req.project = project;
		next();
	} catch (err) {
		res.status(500).json(
			createErrorSchema({
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
				createErrorSchema({
					value: projectId,
					msg: ProjectErrorMsg.IsNotMongoId,
					path: 'projectId',
				}),
			);
		}
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json(
				createErrorSchema({
					value: projectId,
					path: 'projectId',
				}),
			);
		}
		req.project = project;
		next();
	} catch (err) {
		res.status(500).json(
			createErrorSchema({
				msg: 'Ocurrio un error',
				value: req.params.projectId,
			}),
		);
	}
}
