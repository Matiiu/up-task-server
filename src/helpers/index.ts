import { ProjectErrorMsg } from '../data/ErrorMessages';

type TErrors = {
	value?: string;
	msg?: string;
};

export function objErrors({
	value = '',
	msg = ProjectErrorMsg.ProductNotFound,
}: TErrors) {
	return {
		errors: [
			{
				type: 'field',
				value,
				msg,
				path: 'id',
				location: 'params',
			},
		],
	};
}
