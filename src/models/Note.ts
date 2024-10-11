import mongoose, { Schema, Document, Types } from 'mongoose';

export type TNote = Document & {
	content: string;
	createdBy: Types.ObjectId;
	task: Types.ObjectId;
};

const NodeSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		createdBy: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		task: {
			type: Types.ObjectId,
			ref: 'Task',
			required: true,
		},
	},
	{ timestamps: true },
);

const Note = mongoose.model<TNote>('Note', NodeSchema);

export default Note;
