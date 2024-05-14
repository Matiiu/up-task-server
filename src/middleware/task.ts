import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { objErrors } from '../helpers';
import Task, { TTask } from '../models/Task';
import { TaskErrorMsg } from '../data/MessagesAPI';

declare global {
	namespace Express {
		interface Request {
			task: TTask;
		}
	}
}

const validateTaskExists = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { taskId } = req.params;

		if (!Types.ObjectId.isValid(taskId)) {
			return res.status(400).json(
				objErrors({
					value: taskId,
					msg: TaskErrorMsg.IsNotMongoId,
				}),
			);
		}
		const task = await Task.findById(taskId);

		if (!task) {
			return res.status(404).json(
				objErrors({
					msg: TaskErrorMsg.TaskNotFound,
					value: taskId,
				}),
			);
		}
		req.task = task;
		next();
	} catch (err) {
		console.log({ err: err.message });
		res.status(500).json(
			objErrors({
				msg: 'Ocurrio un error',
				value: req.params.taskId,
			}),
		);
	}
};

export default validateTaskExists;
