import bodyParser from 'body-parser';
import compression from 'compression';
import { Response, Request, NextFunction } from 'express';
import express from 'express';
const router = express.Router();

const allowedOrigins = [
	process.env.CLIENT_ROOT_URL, // for web
	'http://localhost', // for android
	'capacitor://localhost' // for ios
];

export default function installMisc(app: any) {
	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
	app.use(compression()); // compress all responses

	app.use((req: Request, res: Response, next: NextFunction) => {
		// Only one Access-Control-Allow-Origin can be (has to be) set so seeing which origin is sending requests and setting header
		const origin = req.headers.origin;
		if (origin && allowedOrigins.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers');

		// intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.sendStatus(200);
		} else {
			next();
		}
	})

	//routes
	// router.use('/analytics', require('../analytics'));

	// api mount path
	app.use('/api', router);
};
