import moongose from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
	try {
		const { connection } = await moongose.connect(process.env.URL_DB);
		const url = `${connection.host}:${connection.port}`;
		console.log(colors.bgMagenta.bold(`Connected to MongoDB on ${url}`));
	} catch (err) {
		console.log(colors.bgRed.bold(`Bad Connection:\n${err?.message}`));
		process.exit(1);
	}
};
