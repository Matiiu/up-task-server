import { CorsOptions } from 'cors';
import colors from 'colors';

const corsConfig: CorsOptions = {
	origin: (origin, callback) => {
		const whiteList = [process.env.FRONTEND_URL];
		console.log(colors.bgBlue.bold(`The origin is ${origin}`));
		if (process.argv.includes('--api')) {
			whiteList.push(undefined);
		}
		if (!whiteList.includes(origin)) {
			callback(new Error('Not allowed by CORS'));
			return;
		}
		callback(null, true);
	},
};

export default corsConfig;
