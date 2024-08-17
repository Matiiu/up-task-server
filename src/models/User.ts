import mongoose, { Schema, Document } from 'mongoose';
import { EMAIL_REGEX } from '../constants/authConstants';
import uniqueValidator from 'mongoose-unique-validator';

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
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		match: [EMAIL_REGEX, 'El correo no es valido'],
	},
	isConfirmed: {
		type: Boolean,
		default: false,
	},
});

UserSchema.plugin(uniqueValidator, {
	message: 'El {PATH} {VALUE} ya esta en uso',
});

const User = mongoose.model<TUser>('User', UserSchema);
export default User;
