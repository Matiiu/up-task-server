import { Request, Response } from 'express';
import Project from '../models/Project';
import colors from 'colors';

class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);
		project.manager = req.user.id;

		try {
			await project.save();
			res.send(`Se creo el proyecto: ${project.projectName}`);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while creating a new project:\n${err?.message}`,
				),
			);
		}
	};

	static getProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({
				manager: req.user.id,
			}).populate('tasks');

			if (!projects) {
				return res.status(404).send('No hay proyectos');
			}
			res.json(projects);
		} catch (error) {
			console.log(
				colors.bgRed.bold.white(
					`An error occurred while getting all projects:\n${error?.message || error}`,
				),
			);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		try {
			res.json(req.project);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while getting a project by its ID:\n${err?.message}`,
				),
			);
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		try {
			req.project.projectName = req.body.projectName;
			req.project.clientName = req.body.clientName;
			req.project.description = req.body.description;

			await req.project.save();
			res.send('Proyecto Actualizado');
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while updating a project by its ID:\n${err?.message}`,
				),
			);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		try {
			await req.project.deleteOne();
			res.send('Proyecto Eliminado');
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while deleting a project by its ID:\n${err?.message}`,
				),
			);
		}
	};
}

export default ProjectController;
