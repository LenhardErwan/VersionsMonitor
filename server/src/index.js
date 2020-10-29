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
const HTTPS = process.env.HTTPS;
const API_ENDPOINT = `${HTTPS ? "https" : "http"}://127.0.0.1:${PORT}/api`;
const server = express();
const app = new App(API_ENDPOINT);
const api = new API(app);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(express.static(path.resolve(__dirname, "..", "public")));
server.use(favicon(path.join(__dirname, "..", "ressources", "favicon.ico")));
if(process.env.CORS) {
	const corsOptions = {
		origin: "http://localhost:2345",
		optionsSuccessStatus: 200
	}
	server.use(cors(corsOptions));
}
server.use('/api', api.router);

if(HTTPS) {
	https.createServer({
		key: fs.readFileSync(path.resolve(__dirname, "..", "ressources", "key.pem")),
		cert: fs.readFileSync(path.resolve(__dirname, "..", "ressources", "cert.pem"))
	}, server).listen(PORT, function () {
		console.log(`Listening on port ${PORT}! (Only HTTPS)`)
	});
}
else {
	http.createServer(server).listen(PORT, function () {
		console.log(`Listening HTTP on port ${PORT}! (Only HTTP)`)
	});
}

server.get('/', function (req, res) {
	try {
		res.sendFile("index.html");
	}
	catch (e) {
		console.error(e.message);
		res.status(404).send("Error with index page<br/>Please contact administrator");
	}
});



