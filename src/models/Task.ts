import mongoose, { Schema, Document, Types } from 'mongoose';

// TS Types
type TTask = Document & {
	name: string;
	description: string;
	projectId: Types.ObjectId;
};

// Mongoose Types
const TaskSchema: Schema = new Schema(
	{
		name: {
			type: String,
			require: true,
			trim: true,
		},
		description: {
			type: String,
			require: true,
			trim: true,
		},
		projectId: {
			type: Types.ObjectId,
			ref: 'Project',
			require: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model<TTask>('Task', TaskSchema);

export default Task;
export { TTask, TaskSchema };
