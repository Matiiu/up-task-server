import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { TTask } from './Task';
import { TUser } from './User';

// TS Types
type TProject = Document & {
	projectName: string;
	clientName: string;
	description: string;
	tasks: PopulatedDoc<TTask & Document>[];
	manager: PopulatedDoc<TUser & Document>;
	team: PopulatedDoc<TUser & Document>[];
};

// Mongoose Types
const ProjectSchema: Schema = new Schema(
	{
		projectName: {
			type: String,
			require: true,
			trim: true,
		},
		clientName: {
			type: String,
			require: true,
			trim: true,
		},
		description: {
			type: String,
			require: true,
			trim: true,
		},
		tasks: [
			{
				type: Types.ObjectId,
				ref: 'Task',
			},
		],
		manager: {
			type: Types.ObjectId,
			ref: 'User',
		},
		team: [
			{
				type: Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true },
);

// Middleware for deleting all tasks when a project is deleted
ProjectSchema.pre('deleteOne', { document: true }, async function () {
	const projectId = this?._id;
	if (!projectId) return;

	const tasks = await mongoose.model('Task').find({ project: projectId });
	if (Array.isArray(tasks) && tasks.length) {
		for (const task of tasks) {
			await task.deleteOne();
		}
	}
});

const Project = mongoose.model<TProject>('Project', ProjectSchema);

export default Project;
export { TProject, ProjectSchema };
