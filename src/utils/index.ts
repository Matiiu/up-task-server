import { ProjectErrorMsg } from '../data/MessagesAPI';

type TErrors = {
	type?: string;
	value?: string;
	msg?: string;
	path?: string;
	location?: string;
};

export function objErrors({
	type = 'field',
	value = '',
	msg = ProjectErrorMsg.ProductNotFound,
	path = 'id',
	location = 'params',
}: TErrors) {
	return {
		errors: [
			{
				type,
				value,
				msg,
				path,
				location,
			},
		],
	};
}
