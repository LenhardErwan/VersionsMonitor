import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import favicon from "serve-favicon";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

import API from "./api/api";
import App from "./app";

const PORT = process.env.PORT;
const HTTPS = process.env.HTTPS.toLowerCase() === "true" ? true : false;
const API_ENDPOINT = `${HTTPS ? "https" : "http"}://127.0.0.1:${PORT}/api`;
const CORS = process.env.CORS.toLowerCase() === "true" ? true : false;
const server = express();
const router = express.Router();
const app = new App(API_ENDPOINT);
const api = new API(app);
const installed = fs.existsSync(path.resolve(__dirname, "..", "installed"));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(express.static(path.resolve(__dirname, "..", "public")));
server.use(favicon(path.join(__dirname, "..", "ressources", "favicon.ico")));
if(CORS) {
	const corsOptions = {
		origin: "http://localhost:2345",
		optionsSuccessStatus: 200
	}
	server.use(cors(corsOptions));
}
server.use('/api', api.router);
server.use('/', router);

if(HTTPS) {
	https.createServer({
		key: fs.readFileSync(path.resolve(__dirname, "..", "ressources", "server-key.pem")),
		cert: fs.readFileSync(path.resolve(__dirname, "..", "ressources", "server-crt.pem")),
		ca: fs.readFileSync(path.resolve(__dirname, "..", "ressources", "ca-crt.pem"))
	}, server).listen(PORT, function () {
		console.log(`Listening on port ${PORT}! (Only HTTPS)`)
	});
}
else {
	http.createServer(server).listen(PORT, function () {
		console.log(`Listening HTTP on port ${PORT}! (Only HTTP)`)
	});
}

router.get('/', function (req, res) {
	try {
		if(!installed) {
			res.redirect('./install');
		}
		else {
			res.sendFile(path.resolve(__dirname, "..", "public", "app.html"));
		}
	}
	catch (e) {
		console.error(e.message);
		res.status(404).send("Error with index page<br/>Please contact administrator");
	}
});


if(!installed) {
	server.use(express.static(path.resolve(__dirname, "..", "install")));
	router.get('/install', function(req, res) {
		res.sendFile(path.resolve(__dirname, "..", "install", "install.html"))
	});

	router.post('/install', function(req, res) {
		console.log(req.body)
		const params = req.body;
		if(/^[0-9]{1,5}$/.test(params.server_ports))
		if(params.db_user)
		if(params.https)
		if(params.cors)
		res.redirect("/")
	});
}


