import jwt from 'jsonwebtoken';
import { TUser } from '../models/User';

type UserPayload = {
	id: TUser['_id'];
};

export function generateJSONWebToken(payload: UserPayload) {
	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
	return token;
}
