import { Request, Response } from 'express';
import Project from '../models/Project';
import colors from 'colors';

class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		try {
			await project.save();
			res.send(`Se creo el proyecto: ${project.projectName}`);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while creating a new project:\n${err?.message}`
				)
			);
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({});
			res.json(projects);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while getting all projects:\n${err?.message}`
				)
			);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({});
			res.json(projects);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while getting a project by its ID:\n${err?.message}`
				)
			);
		}
	};
}

export default ProjectController;
