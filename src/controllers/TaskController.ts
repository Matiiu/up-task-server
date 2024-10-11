import { request, Request, Response } from 'express';
import colors from 'colors';

import Task from '../models/Task';
import { TaskSuccessMsg } from '../data/MessagesAPI';

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
			const task = await Task.findById(req.params.taskId)
				.populate({
					path: 'completedBy.user',
					select: 'id name email',
				})
				.populate({ path: 'notes', populate: { path: 'createdBy' } });
			res.json(task);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while deleting a task:\n${err?.message}`,
				),
			);
		}
	};

	static updateTask = async (req: Request, res: Response) => {
		try {
			req.task.name = req.body.name;
			req.task.description = req.body.description;
			await req.task.save();
			res.send(TaskSuccessMsg.UpdatedTask);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while deleting a task:\n${err?.message}`,
				),
			);
		}
	};

	static deleteTask = async (req: Request, res: Response) => {
		try {
			const { task, project } = req;

			// Delete task from project
			project.tasks = project.tasks.filter(
				(task) => task.toString() !== task.id.toString(),
			);

			await Promise.allSettled([task.deleteOne(), project.save()]);
			res.send(TaskSuccessMsg.DeletedTask);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while deleting a task:\n${err?.message}`,
				),
			);
		}
	};

	static updateStatus = async (req: Request, res: Response) => {
		try {
			const { status } = req.body;
			req.task.status = status;
			const completedBy = {
				user: req.user._id,
				status,
			};
			req.task.completedBy.push(completedBy);

			await req.task.save();
			res.send(TaskSuccessMsg.UpdatedTask);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while updating a status task:\n${err?.message}`,
				),
			);
		}
	};
}

export default TaskController;
