import mongoose, { Schema, Document } from 'mongoose';

export type TUser = Document & {
	name: string;
	email: string;
	password: string;
	isConfirmed: boolean;
};

const UserSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		minLength: [8, 'La contraseña debe tener al menos 8 caracteres'],
		match: [
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*@+])[A-Za-z\d-*@+]{8,}$/,
			'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
		],
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^\S+@\S+\.\S+$/, 'Por favor, ingrese un email válido'],
	},
	isConfirmed: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model<TUser>('User', UserSchema);
export default User;
