import type { Request, Response, NextFunction } from 'express';
import Note, { type TNote } from '../models/Note';
import { Types } from 'mongoose';

declare global {
	namespace Express {
		interface Request {
			note: TNote;
		}
	}
}

export async function validateNoteExists(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { noteId } = req.params;
	const note = await Note.findById(noteId);
	if (!note) {
		return res.status(404).json({ message: 'Nota no encontrada' });
	}

	req.note = note;
	next();
}

export function validatePermission(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const { note } = req;

	if (note.createdBy.toString() !== req.user._id.toString()) {
		return res
			.status(403)
			.json({ message: 'No tienes permiso para eliminar esta nota' });
	}
	next();
}
