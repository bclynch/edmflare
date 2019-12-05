import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import { Response, Request, NextFunction } from 'express';
// import express from 'express';
// const router = express.Router();

export default function installMisc(app: any) {
	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
	app.use(compression()); // compress all responses
	const corsOptions: cors.CorsOptions = {
		credentials: true,
		origin: ['http://localhost:4200', 'http://localhost', 'http://192.168.1.151', 'http://192.168.1.151:4200']
	};
	app.use(cors(corsOptions)); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

	// there is a preflight cors resp thing that send out an OPTIONS method which does not have proper headers attached to req
	// this fn sends back a resp of OPTIONS req so it doesn't fuck things up
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers');

		// intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.sendStatus(200);
		} else {
			next();
		}
	})

	//routes
	// router.use('/scrape', require('../scrape'));
	// router.use('/analytics', require('../analytics'));
	// router.use('/mailing', require('../emails').router);
	// // api mount path
	// app.use('/', router);
};
