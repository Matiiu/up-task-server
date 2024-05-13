import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { TTask } from './Task';

// TS Types
type TProject = Document & {
	projectName: string;
	clientName: string;
	description: string;
	tasks: PopulatedDoc<TTask & Document>[];
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
	},
	{ timestamps: true },
);

const Project = mongoose.model<TProject>('Project', ProjectSchema);

export default Project;
export { TProject, ProjectSchema };
