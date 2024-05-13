import { Request, Response } from 'express';
import Project from '../models/Project';
import colors from 'colors';
import { objErrors } from '../helpers';

class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

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

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({});

			if (!projects.length) {
				return res.status(204).json({});
			}
			res.json(projects);
		} catch (err) {
			console.log(
				colors.bgRed.bold(
					`An error occurred while getting all projects:\n${err?.message}`,
				),
			);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		try {
			const project = await Project.findById(req.params.id).populate('tasks');

			if (!project) {
				return res.status(404).json(objErrors({ value: req.params.id }));
			}
			res.json(project);
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
			const project = await Project.findByIdAndUpdate(req.params.id, req.body);

			if (!project) {
				return res.status(404).json(objErrors({ value: req.params.id }));
			}
			await project.save();
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
			const project = await Project.findByIdAndDelete(req.params.id);

			if (!project) {
				return res.status(404).json(objErrors({ value: req.params.id }));
			}
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
