import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Note, { type TNote } from '../models/Note';
import colors from 'colors';

export default class NoteController {
	static create = async (req: Request<{}, {}, TNote>, res: Response) => {
		const { content } = req.body;
		const note = new Note();

		note.content = content;
		note.createdBy = req.user._id;
		note.task = req.task._id;
		console.log({ note });
		req.task.notes.push(note._id);
		try {
			await Promise.allSettled([note.save(), req.task.save()]);
			res.send('Nota creada correctamente');
		} catch (error) {
			console.log(
				colors.bgRed.bold(
					'An error occurred while creating a note:\n' + error?.message ||
						error,
				),
			);
			res.status(500).json({ message: 'Error inesperado' });
		}
	};

	static getAll = async (req: Request<{}, {}, TNote>, res: Response) => {
		try {
			const notes = await Note.find({ task: req.task._id });
			res.json(notes);
		} catch (error) {
			console.log(
				colors.bgRed.bold(
					'An error occurred while fetching notes:\n' + error?.message || error,
				),
			);
			res.status(500).json({ message: 'Error inesperado' });
		}
	};

	static delete = async (req: Request, res: Response) => {
		req.task.notes = req.task.notes.filter(
			(note) => note.toString() !== req.note._id.toString(),
		);

		try {
			await Promise.allSettled([req.note.deleteOne(), req.task.save()]);
			res.send('Nota eliminada correctamente');
		} catch (error) {
			console.log(
				colors.bgRed.bold(
					'An error occurred while deleting a note:\n' + error?.message ||
						error,
				),
			);
			res.status(500).json({ message: 'Error inesperado' });
		}
	};
}
