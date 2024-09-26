import { Request, Response, NextFunction } from 'express';
import colors from 'colors';
import jwt from 'jsonwebtoken';
import User, { TUser } from '../models/User';

declare global {
	namespace Express {
		interface Request {
			userId: TUser['_id'];
			authenticatedUser: Omit<TUser, 'password'>;
		}
	}
}

export function handleUserAuthentication(
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
			return res.status(401).json({ error: 'Invalid token payload' });
		}
		req.userId = decoded.id;
		next();
	} catch (error) {
		console.log(colors.bgRed.white(error?.message || error));
		return res.status(401).json({ error: 'Invalid token' });
	}
}

export async function validateUser(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (!req.userId) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const user = await User.findById(req.userId).select(
			'_id email name createdAt updatedAt',
		);
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		req.authenticatedUser = user;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}
