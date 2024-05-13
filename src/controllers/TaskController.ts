import { Request, Response } from 'express';
import colors from 'colors';

import Task from '../models/Task';
import { objErrors } from '../helpers';
import { TaskErrorMsg } from '../data/ErrorMessages';

class TaskController {
	static createTask = async (req: Request, res: Response) => {
		try {
			// Send request body
			const task = new Task(req.body);

			const { project } = req;
			// Add the project ID
			task.project = project.id;
			// Add the task to our project list
			project.tasks.push(task.id);
			await Promise.allSettled([task.save(), project.save()]);
			res.send(`la tarea ${task.name} ha sido creada`);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while creating a new task:\n${err?.message}`,
				),
			);
		}
	};

	static getProjectTasks = async (req: Request, res: Response) => {
		try {
			const tasks = await Task.find({ project: req.project.id }).populate(
				'project',
			);

			if (!tasks.length) {
				return res.status(204).json({});
			}
			res.json(tasks);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while getting the tasks:\n${err?.message}`,
				),
			);
		}
	};

	static getTaskById = async (req: Request, res: Response) => {
		try {
			console.log(req.params.taskId);
			const task = await Task.findById(req.params.taskId);

			if (task.project.toString() !== req.project.id) {
				return res.status(400).json(
					objErrors({
						value: req.params.taskId,
						msg: TaskErrorMsg.NotBelongToTheProduct,
					}),
				);
			}
			if (!task) {
				return res.status(404).json(
					objErrors({
						value: req.params.taskId,
						msg: TaskErrorMsg.TaskNotFound,
					}),
				);
			}
			res.json(task);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while deleting a task:\n${err?.message}`,
				),
			);
		}
	};
}

export default TaskController;
