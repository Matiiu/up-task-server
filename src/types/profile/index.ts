import { TUser } from '../../models/User';

export type UpdatePassword = {
	currentPassword: string;
	newPassword: string;
	passwordConfirmation: string;
};
