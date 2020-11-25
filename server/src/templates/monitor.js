import { JSDOM } from "jsdom";
import fetch, { Headers } from "node-fetch";

import Model from "../Model";

export default class Monitor {
	constructor({id, name, url, selector, regex, image, versions, headers}, option = {}) {
		if(option.patch) {	//In the case of a change, not all of the variables are required.
			if(name !== undefined) this.name = name;
			if(url !== undefined) this.url = url;
			if(selector !== undefined) this.selector = selector;
			if(regex !== undefined) this.regex = regex;
			if(image !== undefined) this.image = image;
		}
		else {
			this.id = id ? id : null;
			this.name = name;
			this.url = url;
			this.selector = selector;
			this.regex = regex ? regex : null;
			this.image = image ? image : null;
			this.versions = versions ? versions : new Array();
			this.headers = headers ? headers : new Array();

			let test;

			if(this.name.length > 30) throw "The name cannot exceed 20 characters";
			if(this.url.length > 255) throw "The URL cannot exceed 255 characters";
			if(this.selector.length > 255) throw "The selector cannot exceed 255 characters";
			if(this.regex && this.regex.length > 50) throw "The URL cannot exceed 50 characters";
			if(this.image && this.image.length > 255) throw "The URL cannot exceed 255 characters";
			try {
				test = new URL(this.url);
			} catch (err) {
				throw "Invalid URL";
			}
			if(test.protocol !== "http:" && test.protocol !== "https:") throw "URL is not a valid HTTP URL";
		}
	}

	async checkNewVersion() {
		let headers_params = new Headers();
		for (const header of this.headers) {
			headers_params.append(header.title, header.value)
		}

		try {
			const response = await fetch(this.url, {headers: headers_params});
			if(!response.ok) throw `Error with given URL! status code: ${response.status}`;
			const data = await response.text();
			const dom = new JSDOM(data);
			const selected = dom.window.document.querySelector(this.selector);
			if(selected == undefined || selected == null) throw "Error with given selector, if you are sure about it, think about Headers parameters.";
			let newest = selected.textContent;
			const regex_obj = new RegExp(this.regex);
			const result = regex_obj.exec(newest);
			if(result && result[1]) newest = result[1];
	
			let updated = false;
			if(this.versions.length <= 0 || newest != this.versions[0].value) {
				try {
					await Model.createVersion(this.id, newest);
					updated = true;
				}
				catch(e) {
					console.error(e);
				}
			}
			
			return {newest: newest, updated: updated};
		}
		catch (err) {
			if(err.errno) throw err.message;
			else throw err;
		}
	}
}