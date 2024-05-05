import mongoose, { Schema, Document, Types } from 'mongoose';

const taskStatus = {
	PENDING: 'pending',
	ON_HOLD: 'onHold',
	IN_PROGRESS: 'inProgress',
	UNDER_REVIEW: 'underReview',
	COMPLETED: 'completed',
} as const;

type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

// TS Types
type TTask = Document & {
	name: string;
	description: string;
	projectId: Types.ObjectId;
	status: TaskStatus;
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
		status: {
			type: String,
			enum: Object.values(taskStatus),
			default: taskStatus.PENDING,
		},
	},
	{ timestamps: true }
);

const Task = mongoose.model<TTask>('Task', TaskSchema);

export default Task;
export { TaskStatus, taskStatus, TTask, TaskSchema };
