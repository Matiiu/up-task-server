import { ProductErrorMsg } from '../data/ErrorMessages';

type ObjErrors = {
	value?: string;
	msg?: string;
};

export function objErrors({
	value = '',
	msg = ProductErrorMsg.ProductNotFound,
}: ObjErrors) {
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
