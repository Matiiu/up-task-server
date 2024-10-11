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

export function validateUserPermissions(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { id } = req.params;
		const { team } = req.project;

		if (
			req.project.manager.toString() !== req.authenticatedUser.id.toString() &&
			!team.includes(req.authenticatedUser.id)
		) {
			return res.status(403).json(
				createErrorSchema({
					msg: 'No tienes permisos para acceder a este proyecto',
					value: id,
				}),
			);
		}
		next();
	} catch (err) {
		res.status(500).json(
			createErrorSchema({
				msg: 'Ocurrió un error',
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
					msg: 'Proyecto no encontrado',
				}),
			);
		}
		req.project = project;
		next();
	} catch (err) {
		res.status(500).json(
			createErrorSchema({
				msg: 'Ocurrió un error',
				value: req.params.projectId,
			}),
		);
	}
}
