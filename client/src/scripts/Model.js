import Monitor from "../templates/monitor";
const storage = window["localStorage"];

export default class Model {

	static endpoint = "";

	static async makeRequest(path, method, requestBody = null) {
		const headers = new Headers();
		if(requestBody) {
			headers.append("Accept", "application/json");
			headers.append("Content-Type", "application/json");
		}

		const myInit = {
			headers: headers,
			method: method,
			body: requestBody ? JSON.stringify(requestBody) : null,
			mode: "cors"
		}

		const res = await fetch(`${Model.endpoint}${path}`, myInit);
		if(!res.ok) {
			if(res.status == 500 || res.status == 400) {
				const data = await res.json();
				throw {msg: data.error, code: res.status};
			}
			else {
				throw `Error in fetch! status code: ${res.status}`;
			}
		}
		const data = await res.json();
		return data;
	}

  static async getMonitors() {
		const data = await Model.makeRequest(`/api/monitors`, "GET");
		const monitors = new Map();
		for (const monitor of data.got) {
			try {
				const nmonitor = new Monitor(monitor);
				monitors.set(nmonitor.id, nmonitor);
			} catch (e) {
				console.error(e);
			}
		}
		return monitors;
	}

	static async getMonitor(id) {
		const data = await Model.makeRequest(`/api/monitors/${id}`, "GET");
		return new Monitor(data.got);
	}

	static async checkMonitor(id) {
		const data = await Model.makeRequest(`/api/monitors/${id}/check`, "POST");
		return new Monitor(data.got);
	}

	static async createMonitor(params) {
		return await Model.makeRequest(`/api/monitors`, "POST", new Monitor(params, {create: true}));
	}

	static async updateMonitor(id, params) {
		return await Model.makeRequest(`/api/monitors/${id}`, "PATCH", new Monitor(params, {update: true}));
	}
	
	static async deleteMonitor(id) {
		return await Model.makeRequest(`/api/monitors/${id}`, "DELETE");
	}

	static async getHeaders() {
		const data = await Model.makeRequest(`/api/headers`, "GET");
		if(data.success) {
			const headers = new Map();
			for (const header of data.got) {
				headers.set(header.id, header);
			}
			return headers;
		}
		else {
			throw {error: data.error}
		}
	}

	static async createHeader(header) {
		return await Model.makeRequest(`/api/headers`, "POST", header)
	}

	static async updateHeader(id, header) {
		return await Model.makeRequest(`/api/headers/${id}`, "PATCH", header)
	}

	static async deleteHeader(id) {
		return await Model.makeRequest(`/api/headers/${id}`, "DELETE")
	}

	static async linkHeaderToMonitor(monitor_id, header_id) {
		return await Model.makeRequest(`/api/monitors/${monitor_id}/headers/${header_id}`, "POST");
	}

	static async unlinkHeaderToMonitor(monitor_id, header_id) {
		return await Model.makeRequest(`/api/monitors/${monitor_id}/headers/${header_id}`, "DELETE");
	}

	static async createAndLinkHeader(monitor_id, header) {
		return await Model.makeRequest(`/api/monitors/${monitor_id}/headers`, "POST", header);
	}

	static async deleteVersion(id) {
		return await Model.makeRequest(`/api/versions/${id}`, "DELETE");
	}
	
	static async saveInStorage(name, object) {
		storage.setItem(name, JSON.stringify(object));
	}

	static loadFromStorage(name) {
		const json = storage.getItem(name);
		if(json != "undefined") {
			const object = JSON.parse(json);
			return object;
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

	static getDateFormatString() {
		const locale = window.navigator.userLanguage || window.navigator.language;
		const formatObj = new Intl.DateTimeFormat(locale).formatToParts();

    return formatObj
      .map(obj => {
        switch (obj.type) {
					case "second":
						return "ss";
					case "minute":
						return "mm";
					case "hour":
						return "hh";
          case "day":
            return "DD";
          case "month":
            return "MM";
          case "year":
						return "YYYY";
          default:
            return obj.value;
        }
      })
      .join("");
  }
}
