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
	project: Types.ObjectId;
	status: TaskStatus;
	completedBy: {
		user: Types.ObjectId;
		status: TaskStatus;
	}[];
	notes: Types.ObjectId[];
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
		project: {
			type: Types.ObjectId,
			ref: 'Project',
			require: true,
		},
		status: {
			type: String,
			enum: Object.values(taskStatus),
			default: taskStatus.PENDING,
		},
		completedBy: [
			{
				user: {
					type: Types.ObjectId,
					ref: 'User',
					default: null,
				},
				status: {
					type: String,
					enum: Object.values(taskStatus),
					default: taskStatus.PENDING,
				},
			},
		],
		notes: [
			{
				type: Types.ObjectId,
				ref: 'Note',
			},
		],
	},
	{ timestamps: true },
);

// Middleware for deleting all notes when a task is deleted
TaskSchema.pre('deleteOne', { document: true }, async function () {
	const taskId = this?._id;
	if (!taskId) return;
	await mongoose.model('Note').deleteMany({ task: taskId });
});

const Task = mongoose.model<TTask>('Task', TaskSchema);

export default Task;
export { TaskStatus, taskStatus, TTask, TaskSchema };
