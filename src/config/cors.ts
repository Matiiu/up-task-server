import { CorsOptions } from 'cors';

const corsConfig: CorsOptions = {
	origin: (origin, callback) => {
		const whiteList = [process.env.FRONTEND_URL];

		if (!whiteList.includes(origin)) {
			callback(new Error('Not allowed by CORS'));
			return;
		}
		callback(null, true);
	},
};

export default corsConfig;
