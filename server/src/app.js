import fetch from "node-fetch";
import https from "https"

import Monitor from "./templates/monitor";
import Model from './Model'

export default class App {
	constructor(endpoint, https) {
		Model.init({
			user: process.env.DB_USER,
			password: process.env.DB_PASSWD,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME
		});
		this.endpoint = endpoint;
		this.https = https;
		this.db_connected = false
		this.monitors = new Map();
		this.inError = new Map();

		this.load()
			.then(async () => {
				this.db_connected = true
				await this.checkAllVersion();
				setInterval(this.checkAllVersion, 43200000) //12H
			})
			.catch((err) => {
				this.db_connected = false;
				console.error("Error with database communication!\n", err);
			});

		this.reload = this.load.bind(this);
		this.setMonitor = this.setMonitor.bind(this);
		this.deleteMonitor = this.deleteMonitor.bind(this);
		this.checkAndReload = this.checkAndReload.bind(this);
		this.reloadMonitor = this.reloadMonitor.bind(this);
		this.checkAllVersion = this.checkAllVersion.bind(this);
	}

	async load() {
		let response;
		if(this.https) {
			const agent = new https.Agent({
				rejectUnauthorized: false
			})
			response = await fetch(`${this.endpoint}/monitors`, {agent});
		}
		else {
			response = await fetch(`${this.endpoint}/monitors`);
		}
		if(!response.ok) throw {message: `Error in fetch! status code: ${response.status}`, code: response.status};
		const data = await response.json();
		if(data.success) {
			const map = new Map();
			for (const monitor of data.got) {
				try {
					const nmonitor = new Monitor(monitor);
					map.set(nmonitor.id, nmonitor);
				} catch (e) {
					this.inError.set(monitor.id, {monitor: monitor, error: e});
				}
			}
			this.monitors = map;
		}
		else {
			throw {error: data.error}
		}
	}

	setMonitor(monitor) {
		this.monitors.set(monitor.id, monitor);
	}

	deleteMonitor(monitor_id) {
		this.monitors.delete(monitor_id);
	}

	async checkAndReload(monitor_id) {
		try {
			const pre_monitor = await Model.getMonitor(monitor_id)
			const res = await new Monitor(pre_monitor).checkNewVersion();
			this.reloadMonitor(monitor_id);
			return res;
		} catch (e) {
			throw e;
		}
	}

	async reloadMonitor(monitor_id) {
		const nmonitor = new Monitor(await Model.getMonitor(monitor_id));
		this.setMonitor(nmonitor);
	}

	async checkAllVersion() {
		for (const [id, monitor] of this.monitors) {
			try {
				const result = await monitor.checkNewVersion();
				if(result.update) {
					//TODO Do something on update (like mail)
				}
			}
			catch (e) {
				this.inError.set(id, {monitor: monitor, error: e});
			}
		}
	}
}