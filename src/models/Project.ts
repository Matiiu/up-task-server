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
	},
	{ timestamps: true },
);

const Project = mongoose.model<TProject>('Project', ProjectSchema);

export default Project;
export { TProject, ProjectSchema };
