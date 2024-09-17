import { Request, Response, NextFunction } from 'express';
import colors from 'colors';
import jwt from 'jsonwebtoken';
import User, { TUser } from '../models/User';

declare global {
	namespace Express {
		interface Request {
			userId: TUser['_id'];
			safeUser: Omit<TUser, 'password' | 'createdAt' | 'updatedAt' | '__v'>;
		}
	}
}

export function handleAuthenticate(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const bearer = req.headers.authorization;
		if (!bearer) {
			throw new Error('No autorizado');
		}
		const token = bearer.split(' ')[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (typeof decoded === 'string' || !('id' in decoded)) {
			return res.status(401).json({ message: 'Invalid token payload' });
		}
		req.userId = decoded.id;
		next();
	} catch (error) {
		console.log(colors.bgRed.white(error?.message || error));
		return res.status(401).json({ message: 'Invalid token' });
	}
}

export async function validateUser(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (!req.userId) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const safeUser = await User.findById(req.userId).select(
			'-password -createdAt -updatedAt -__v',
		);
		if (!safeUser) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.safeUser = safeUser;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
}
