import { Request, Response } from 'express';
import colors from 'colors';

import Task from '../models/Task';

class TaskController {
	static createTask = async (req: Request, res: Response) => {
		try {
			// Send request body
			const task = new Task(req.body);

			const { project } = req;
			// Add the project ID
			task.projectId = project.id;
			// Add the task to our project list
			project.taskIds.push(task.id);
			await task.save();
			await project.save();
			res.send(`la tarea ${task.name} ha sido creada`);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while creating a new project:\n${err?.message}`
				)
			);
		}
	};
}

export default TaskController;
