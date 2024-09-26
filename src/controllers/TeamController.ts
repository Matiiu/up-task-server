import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

export default class TeamController {
	static async addMemberByUserId(req: Request, res: Response) {
		try {
			const { userId } = req.body;
			const user = await User.findById(userId).select('-password');
			if (!user) {
				return res.status(404).json({ message: 'Usuario No Encontrado' });
			}
			const isExistingUser = req.project.team.some(
				(id) => id.toString() === user.id.toString(),
			);
			if (isExistingUser) {
				return res
					.status(409)
					.json({ message: 'El usuario ya hace parte del equipo' });
			}
			req.project.team.push(user.id);
			await req.project.save();
			res.send('Se ha añadido el miembro al proyecto correctamente');
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async getTeam(req: Request, res: Response) {
		try {
			const { projectId } = req.params;
			const project = await Project.findById(projectId).populate({
				path: 'team',
				select: '_id name email createdAt updatedAt',
				match: { isConfirmed: true },
			});
			res.json(project.team);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async findMemberByEmail(req: Request, res: Response) {
		try {
			const { email } = req.body;
			const user = await User.findOne({ email, isConfirmed: true }).select(
				'_id email name createdAt updatedAt',
			);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			res.json(user);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async removeMemberByUserId(req: Request, res: Response) {
		try {
			const { userId } = req.body;
			const isExistingUser = req.project.team.some(
				(id) => id.toString() === userId.toString(),
			);
			if (!isExistingUser) {
				return res
					.status(409)
					.json({ message: 'El usuario no hace parte del equipo' });
			}

			req.project.team = req.project.team.filter(
				(id) => id.toString() !== userId.toString(),
			);
			await req.project.save();
			res.send('Se ha eliminado el miembro del proyecto correctamente');
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}
