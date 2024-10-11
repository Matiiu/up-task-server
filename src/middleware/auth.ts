import { Request, Response, NextFunction } from 'express';
import colors from 'colors';
import jwt from 'jsonwebtoken';
import User, { type TUser } from '../models/User';

declare global {
	namespace Express {
		interface Request {
			user: TUser;
			authenticatedUser: Omit<TUser, 'password'>;
		}
	}
}

export async function handleUserAuthentication(
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
		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(401).json({ error: 'Invalid token' });
		}
		req.user = user;
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
	const { id } = req.user;
	if (!id) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const user = await User.findById(id).select(
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
