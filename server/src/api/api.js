import express from "express";
import swaggerUI from "swagger-ui-express";

import MonitorsMW from "./monitors";
import HeadersMW from "./headers";
import VersionsMW from "./versions";
import OASDoc from "./OASDoc";

export default class API {
	constructor(app) {
		this.app = app;
		this.router = express.Router();

		const options = {
			customSiteTitle: "VersionsMonitor API",
			swaggerOptions: {
				defaultModelRendering: "model",
				defaultModelExpandDepth: 5,
				defaultModelsExpandDepth: 1,
				showExtensions: true,
				syntaxHighlight: {
					activate: true,
					theme: "nord"
				}
			}
		};

		this.router.use('/docs', swaggerUI.serve, swaggerUI.setup(OASDoc, options));
		this.router.use('/monitors', new MonitorsMW(this.app).router);
		this.router.use('/headers', new HeadersMW(this.app).router);
		this.router.use('/versions', new VersionsMW(this.app).router);

		this.router.get('/', (req, res) => {
			res.redirect('./api/docs')
		});
	}
}