import { Pool, Query } from "pg";

const queryTexts = {
	getMonitors: `SELECT * FROM "versionsmonitor"."monitor" ORDER BY id`,
	getMonitor: `SELECT * FROM "versionsmonitor"."monitor" WHERE id=$1`,
	createMonitor: `INSERT INTO "versionsmonitor"."monitor" (name,url,selector,regex,image) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
	modifyMonitor: `UPDATE "versionsmonitor"."monitor" SET($paramSet)=ROW($paramValues) WHERE id=$1 RETURNING *`,
	deleteMonitor: `DELETE FROM "versionsmonitor"."monitor" WHERE id=$1 RETURNING *`,
	getVersions: `SELECT * FROM "versionsmonitor"."version"`,
	getVersion: `SELECT * FROM "versionsmonitor"."version" WHERE id=$1`,
	getVersionsOfMonitor: `SELECT id, value, discovery_timestamp FROM "versionsmonitor"."version" WHERE monitor_id = $1 ORDER BY discovery_timestamp DESC LIMIT $2`,
	createVersion: `INSERT INTO "versionsmonitor"."version" (monitor_id, value, discovery_timestamp) VALUES ($1 ,$2 , $3) RETURNING *`,
	modifyVersion: `UPDATE "versionsmonitor"."version" SET(value, discovery_timestamp)=($2, $3) WHERE id=$1 RETURNING *`,
	deleteVersion: `DELETE FROM "versionsmonitor"."version" WHERE id=$1 RETURNING *`,
	getHeaders: `SELECT * FROM "versionsmonitor"."header"`,
	getHeader: `SELECT * FROM "versionsmonitor"."header" WHERE id=$1`,
	getHeadersOfMonitor: `SELECT H.id, title, value FROM "versionsmonitor"."header" H INNER JOIN "versionsmonitor"."monitorheader" M ON H.id = M.header_id WHERE M.monitor_id = $1`,
	getMonitorsIDOfHeader: `SELECT monitor_id FROM "versionsmonitor"."monitorheader" WHERE header_id=$1`,
	createHeader: `INSERT INTO "versionsmonitor"."header" (title, value) VALUES ($1, $2) RETURNING *`,
	modifyHeader: `UPDATE "versionsmonitor"."header" SET(title, value)=($2, $3) WHERE id=$1 RETURNING *`,
	deleteHeader: `DELETE FROM "versionsmonitor"."header" WHERE id=$1 RETURNING *`,
	linkMonitorHeader: `INSERT INTO "versionsmonitor"."monitorheader" (monitor_id, header_id) VALUES ($1, $2)`,
	unlinkMonitorHeader: `DELETE FROM "versionsmonitor"."monitorheader" WHERE monitor_id=$1 AND header_id=$2`
}

export default class Model {
	static pool;

	static init(params) {
		Model.pool = new Pool(params);

		Model.pool.on("error", (err, client) => {
			console.error("Unexpected error on idle client", err)
		});
	}

	static async getMonitors() {
		const monitors = new Array();
		const res = await Model.pool.query(queryTexts.getMonitors);
		for (const row of res.rows) {
			let monitor = {...row};
			monitor.versions = await Model.getVersionsOfMonitor(monitor.id);
			monitor.headers = await Model.getHeadersOfMonitor(monitor.id);
			monitors.push(monitor);
		}
		return monitors;
	}

	static async getMonitor(id) {
		const res = await Model.pool.query(queryTexts.getMonitor, [id]);
		if(res.rows.length > 0) {
			let monitor = res.rows[0]
			monitor.versions = await Model.getVersionsOfMonitor(monitor.id);
			monitor.headers = await Model.getHeadersOfMonitor(monitor.id);
			return monitor;
		}
		else {
			return null;
		}
	}

	static async createMonitor(monitor) {
		if(!monitor.name || monitor.name == "") throw {message: "Monitor's name can't be null"};
		if(!monitor.url || monitor.url == "") throw {message: "Monitor's URL can't be null"};
		if(!monitor.selector || monitor.selector == "") throw {message: "Monitor's selector can't be null"};

		const res = await Model.pool.query(queryTexts.createMonitor, [monitor.name, monitor.url, monitor.selector, monitor.regex, monitor.image]);
		return res.rows[0];
	}

	static async modifyMonitor(id, map) {
		const res = await Model.pool.query(queryTexts.modifyMonitor.replace("$paramSet", [...map.keys()].join(",")).replace("$paramValues", Model.strForSQL(map.size, 2)),[id, ...map.values()]);	
		if(res.rows.length <= 0) throw {message: "No monitor updated with given id", id: id};
		return res.rows[0];
	}

	static async deleteMonitor(id) {
		const res = await Model.pool.query(queryTexts.deleteMonitor, [id]);	
		if(res.rows.length <= 0) throw {message: "No monitor deleted with given id", id: id};
		return res.rows[0];
	}

	static async getVersions() {
		const res = await Model.pool.query(queryTexts.getVersions);
		return res.rows;
	}

	static async getVersion(id) {
		const res = await Model.pool.query(queryTexts.getVersion, [id]);
		if(res.rows.length <= 0) throw {message: "No version found with given id", id: id};
		return res.rows[0];
	}

	static async getVersionsOfMonitor(id, nb_rows = 5) {
		const res = await Model.pool.query(queryTexts.getVersionsOfMonitor, [id, nb_rows]);
		return res.rows;
	}

	static async createVersion(monitor_id, version, timestamp = new Date()) {
		try {
			const res = await Model.pool.query(queryTexts.createVersion, [monitor_id, version, timestamp]);
			return res.rows[0];
		}
		catch(e) {
			if(e.code === "23503") throw {message: `Monitor id has no monitor reference`, id: monitor_id};
			else throw e;
		}
	}

	static async modifyVersion(id, value, timestamp) {
		if(!value || value == "") throw {message: "version's value can't be null"};
		if(!timestamp || timestamp == "") throw {message: "version's timestamp can't be null"};
		const res = await Model.pool.query(queryTexts.modifyVersion,[id, value, timestamp]);	
		if(res.rows.length <= 0) throw {message: "No version updated with given id", id: id};
		return res.rows[0];
	}

	static async deleteVersion(id) {
		const res = await Model.pool.query(queryTexts.deleteVersion, [id]);	
		if(res.rows.length <= 0) throw {message: "No version deleted with given id", id: id};
		return res.rows[0];
	}


	static async getHeaders() {
		const res = await Model.pool.query(queryTexts.getHeaders);
		return res.rows;
	}

	static async getHeader(id) {
		const res = await Model.pool.query(queryTexts.getHeader, [id]);
		if(res.rows.length <= 0) throw {message: "No header found with given id", id: id};
		return res.rows[0];
	}

	static async getHeadersOfMonitor(id) {
		const res = await Model.pool.query(queryTexts.getHeadersOfMonitor, [id]);
		return res.rows;
	}

	static async getMonitorsOfHeader(id) {
		const rows = await this.getMonitorsIDOfHeader(id);
		const monitors = new Array();
		for (const row of rows) {
			monitors.push(await this.getMonitor(row.monitor_id));
		}
		return monitors;
	}

	static async getMonitorsIDOfHeader(id) {
		const res = await Model.pool.query(queryTexts.getMonitorsIDOfHeader, [id]);
		return res.rows;
	}

	static async createHeader(title, value) {
		if(!title || title == "") throw {message: "header's title can't be null"};
		if(!value || value == "") throw {message: "header's value can't be null"};
		const res = await Model.pool.query(queryTexts.createHeader, [title, value]);
		return res.rows[0];
	}

	static async modifyHeader(id, title, value) {
		if(!title || title == "") throw {message: "header's title can't be null"};
		if(!value || value == "") throw {message: "header's value can't be null"};
		const res = await Model.pool.query(queryTexts.modifyHeader, [id, title, value]);	
		if(res.rows.length <= 0) throw {message: "No header updated with given id", id: id};
		return res.rows[0];
	}

	static async deleteHeader(id) {
		const res = await Model.pool.query(queryTexts.deleteHeader, [id]);	
		if(res.rows.length <= 0) throw {message: "No header deleted with given id", id: id};
		return res.rows[0];
	}


	static async linkMonitorHeader(monitor_id, header_id) {
		if(!monitor_id || monitor_id == "") throw {message: "monitor_id can't be null"};
		if(!header_id || header_id == "") throw {message: "header_id can't be null"};
		await Model.pool.query(queryTexts.linkMonitorHeader, [monitor_id, header_id]);
	}

	static async unlinkMonitorHeader(monitor_id, header_id) {
		if(!monitor_id || monitor_id == "") throw {message: "monitor_id can't be null"};
		if(!header_id || header_id == "") throw {message: "header_id can't be null"};
		await Model.pool.query(queryTexts.unlinkMonitorHeader, [monitor_id, header_id]);
	}

	static async createAndLinkHeader(header, monitor_id) {
		const client = await Model.pool.connect();
		try {
			await client.query("BEGIN");
			const res_create = await client.query(queryTexts.createHeader, [header.title, header.value]);
			await client.query(queryTexts.linkMonitorHeader, [monitor_id, res_create.rows[0].id]);
			await client.query("COMMIT");
			return res_create.rows[0];
		} catch(e) {
			await client.query("ROLLBACK");
			throw e;
		} finally {
			client.release();
		}
	}


	static strForSQL(number, startAt) {
		let str = ""
		for (let i = 0; i < number; i++) {
			str += `$${i+startAt},`
		}
		if(str.endsWith(",")) str = str.substr(0, str.length-1);
		return str
	}
}