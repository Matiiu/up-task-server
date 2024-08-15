type ErrorSchema = {
	type?: string;
	value?: string;
	msg?: string;
	path?: string;
	location?: string;
};

export function createErrorSchema({
	type = 'field',
	value = '',
	path = 'id',
	location = 'params',
	msg = '',
}: ErrorSchema) {
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
