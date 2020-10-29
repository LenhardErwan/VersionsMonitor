export default class Monitor {
	constructor({id, name, url, selector, regex, image, versions, headers}, option = {}) {
		if(option.create) {
			this.name = name;
			this.url = url;
			this.selector = selector;
			if(regex != undefined) this.regex = regex;
			if(image != undefined) this.image = image;
			if(headers != undefined) this.headers = headers
		}
		else if(option.update) {	//In the case of a change, not all of the variables are required.
			if(name != undefined) this.name = name;
			if(url != undefined) this.url = url;
			if(selector != undefined) this.selector = selector;
			if(regex != undefined) this.regex = regex;
			if(image != undefined) this.image = image;
		}
		else {
			this.id = id ? id : null;
			this.name = name;
			this.url = url;
			this.selector = selector;
			this.regex = regex ? regex : null;
			this.image = image ? image : null;
			this.versions = versions ? versions : new Array();
			if(headers && headers instanceof Array) {
				const nheaders = new Map();
				for (const header of headers) {
					nheaders.set(header.id, header);
				}
				this.headers = nheaders;
			}
			else {
				this.headers = new Map();
			}
			this.inError = false;
		}
	}
}