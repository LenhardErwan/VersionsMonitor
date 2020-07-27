import fs from "fs";
import path from "path";
import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import { Headers } from "node-fetch";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();
const upload = multer();
if(process.env.NODE_ENV && process.env.NODE_ENV == "debug") app.use(cors());
app.use(upload.array());
const port = 8012;

app.use(express.static(path.resolve(__dirname, '..', "public")));

app.get('/', function (req, res) {
	res.sendFile('index.html');
})

app.post('/get-newest', (req, res) => {
	if(req.body.url && req.body.selector) {
		getNewest(req.body.url, req.body.selector, req.body.regex, req.body.headers)
			.then((value) => {
				res.json({error: false, value: value});
			})
			.catch((value) => {
				res.json({error: true, value: value.message});
			})
	}
	else {
		res.json({error: true, value: "Request doesn't have any url or selector"});
	}
});

app.get("/get-conf", (req, res) => {
	fs.readFile(path.resolve(__dirname, '..', "ressources", "conf.json"), (err, json) => {
		res.json(JSON.parse(json));
	})
});

app.post("/set-conf", (req, res) => {
	if(req.body.json) {
		writeConf(req.body.json)
			.then((value) => {

			})
			.catch((value) => {
				res.json({error: true, value: value});
			});
	}
	else {
		res.json({error: true, value: "No JSON given"})
	}
});

app.listen(port, function () {
	console.log(`Listening on port ${port}!`)
})

async function getNewest(url, selector, regex, headers_json) {
	let headers_params = new Headers();
	const headers = jsonToMap(headers_json);
	headers.forEach((value, key) => {
		headers_params.append(key, value);
	});
	const response = await fetch(url, {headers: headers_params});
	if(!response.ok) throw new Error(`Error in fetch! status code: ${response.status}`);
	const data = await response.text();
	const dom = new JSDOM(data);
	let selected = dom.window.document.querySelector(selector);
	if(selected == undefined || selected == null) throw new Error("Error with given selector, if you are sure about it think about Headers parameters.");
	let newest = selected.textContent;
	const regex_obj = new RegExp(regex);
	const result = regex_obj.exec(newest);
	if(result && result[1]) newest = result[1];
	
	return newest;
}

async function writeConf(json) {
	fs.writeFile(path.resolve(__dirname, '..', "ressources", "conf.json"), json, (err) => {
		if(err) throw new Error(err);
	});
}

function jsonToMap(jsonStr) {
	return new Map(JSON.parse(jsonStr));
}