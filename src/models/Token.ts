import mongoose, { Schema, Document, Types } from 'mongoose';

export type TToken = Document & {
	token: string;
	user: Types.ObjectId;
	createdAt: Date;
};

const tokenSchema: Schema = new Schema({
	token: {
		type: String,
		required: true,
		trim: true,
	},
	user: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
		expires: '10m',
	},
});

const Token = mongoose.model<TToken>('Token', tokenSchema);
export default Token;
