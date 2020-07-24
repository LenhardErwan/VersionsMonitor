var storage = window["localStorage"];

export default class Model {

	static endpoint = "";

	static setEndpoint(endpoint) {
		this.endpoint = endpoint;
	}

	static mapToJson(map) {
		return JSON.stringify([...map]);
	}

	static jsonToMap(json) {
		return new Map(JSON.parse(json));
	}

	static addMinutes(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	}

	static async getNewest(url, selector, regex, headers) {

		const form = new FormData();
		form.append("url", url);
		form.append("selector", selector);
		form.append("regex", regex);
		form.append("headers", Model.mapToJson(headers));

		const myInit = { 
			method: "POST",
			mode: "cors",
			body: form 
		};
							 
    const response = await fetch(`${this.endpoint}/get-newest`, myInit);
		if(!response.ok) throw new Error(`Error fetch: ${response.status} | ${response.body}`);
		const data = await response.json();

		if(data && data.error) throw new Error(data.value.toString());
		
		return data.value;
	}
	
	static async getConfFromServ() {
		const response = await fetch(`${this.endpoint}/get-conf`, {mode: "cors"});
		if(!response.ok) throw new Error(`Error fetch: ${response.status} | ${response.body}`)
		const data = await response.text();
		return data;
	}

	static async setConfToServ(monitors) {
		const conf_json = await Model.makeJsonOfMonitors(monitors);
		const form = new FormData();
		form.append("json", conf_json);

		const myInit = { 
			method: "POST",
			mode: "cors",
			body: form 
		};
							 
    const response = await fetch(`${this.endpoint}/set-conf`, myInit);
		if(!response.ok) throw new Error(`Error fetch: ${response.status} | ${response.body}`);
		const data = await response.json();

		if(data && data.error) throw new Error(data.value.toString());
		
		return data.value;
	}

	static async makeJsonOfMonitors(monitors) {
		const monitors_save = new Map();
		for (const [key, monitor] of monitors.entries()) {
			let dc_monitor = {...monitor};
			dc_monitor.headers = this.mapToJson(dc_monitor.headers);
			monitors_save.set(key, dc_monitor);
		}
		return Model.mapToJson(monitors_save);
	}

	static makeMonitorsFromJson(json) {
		const monitors = Model.jsonToMap(json);
		for (const [key, monitor] of monitors.entries()) {
			monitor.headers = Model.jsonToMap(monitor.headers);
		}
		return monitors;
	}
  
  static async saveMonitors(monitors) {
    storage.setItem("monitors", await Model.makeJsonOfMonitors(monitors));
  }

  static async loadMonitors() {
    return this.loadMonitorSync();
  }

  static loadMonitorSync() {
		const json = storage.getItem("monitors");
		if(json != "undefined") {
			return Model.makeMonitorsFromJson(json);
		}
		else {
			return null;
		}
	}
	
	static async savePreferences(preferences) {
		storage.setItem("preferences", JSON.stringify(preferences));
	}

	static async loadPreferences() {
		return this.loadPreferencesSync();
	}

	static loadPreferencesSync() {
		const json = storage.getItem("preferences");
		if(json != "undefined") {
			const preferences = JSON.parse(json);
			return preferences;
		}
		else {
			return null;
		}
	}

  static async localStorageAvailable() {
    try {
      x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0
      );
    }
	}
}
