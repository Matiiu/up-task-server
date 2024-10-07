import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { createErrorSchema } from '../utils/errorUtil';
import Task, { taskStatus, TTask } from '../models/Task';
import { TaskErrorMsg } from '../data/MessagesAPI';

declare global {
	namespace Express {
		interface Request {
			task: TTask;
		}
	}
}

export async function validateTaskExists(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { taskId } = req.params;

		if (!Types.ObjectId.isValid(taskId)) {
			return res.status(400).json(
				createErrorSchema({
					value: taskId,
					msg: TaskErrorMsg.IsNotMongoId,
				}),
			);
		}
		const task = await Task.findById(taskId);

		if (!task) {
			return res.status(404).json(
				createErrorSchema({
					msg: TaskErrorMsg.TaskNotFound,
					value: taskId,
					path: 'taskId',
				}),
			);
		}
		req.task = task;
		next();
	} catch (err) {
		res.status(500).json(
			createErrorSchema({
				msg: 'Ocurrio un error',
				value: req.params.taskId,
			}),
		);
	}
}

export function taskBelongsToProject(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const projectId = req.task.project.toString();
	if (projectId !== req.project.id.toString()) {
		return res.status(400).json(
			createErrorSchema({
				value: req.task.id,
				msg: TaskErrorMsg.NotBelongToTheProject,
				path: 'taskId',
			}),
		);
	}
	next();
}

export function validTaskStatus(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (!Object.values(taskStatus).includes(req.body.status)) {
		return res.status(400).json(
			createErrorSchema({
				msg: TaskErrorMsg.InvalidStatus,
				value: req.body.status,
				path: 'status',
				location: 'body',
			}),
		);
	}
	next();
}

export function hasAuthorization(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.userId.toString() !== req.project.manager.toString()) {
		return res
			.status(403)
			.json({ message: 'No tiene permisos para realizar esta acción' });
	}
	next();
}
