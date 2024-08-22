import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
}

export async function validatePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}
