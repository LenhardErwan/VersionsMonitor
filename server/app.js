import fetch, { Headers } from 'node-fetch';
import { JSDOM } from 'jsdom';

import MonitorsCollection from '/imports/db/MonitorsCollection';

export default class App {
	constructor() {
		this.check = this.check.bind(this);
		this.checkAll = this.checkAll.bind(this);

		setInterval(this.checkAll, 43200000); //12H
	}

	async addVersion(monitor_id, label, date) {
		try {
			await MonitorsCollection.update(
				{ _id: monitor_id },
				{ $push: { versions: { label: label, date: date } } }
			);
		} catch (err) {
			console.error(err);
		}
	}

	async editError(monitor_id, error) {
		try {
			await MonitorsCollection.update(
				{ _id: monitor_id },
				{ $set: { error: error.toString() } }
			);
		} catch (err) {
			console.error(err);
		}
	}

	async check(monitor) {
		const headers = new Headers();
		for (const header of monitor.headers) {
			headers.append(header.name, header.value);
		}

		try {
			const test = new URL(monitor.url); // Test URL
			if (test.protocol !== 'http:' && test.protocol !== 'https:')
				throw 'URL is not a valid HTTP URL'; // Test HTTP URL

			const response = await fetch(monitor.url, { headers: headers }); // Fetch page
			if (!response.ok)
				throw `Error with given URL! status code: ${response.status}`;
			const data = await response.text(); // Get text in this page
			const dom = new JSDOM(data); // Convert Text into DOM page
			const selected = dom.window.document.querySelector(monitor.selector); // Use selector in DOM
			if (selected == undefined || selected == null)
				throw 'Error with given selector, if you are sure about it, think about Headers parameters.';
			let newest = selected.textContent; // Text in selector

			const regex_white_space = /^\s*([^\n\r\f]*)\s*$/gm; // Delete all white spaces before and after the text, if any
			newest = regex_white_space.exec(newest)[1]; // Regex match (1 is for between brackets)

			if (monitor.regex) {
				const regex_obj = new RegExp(monitor.regex);
				const result = regex_obj.exec(newest); // Refine the result with the regex
				if (result && result[1]) newest = result[1]; // If regex as a match (1 is for between first brackets)
			}

			monitor.versions.sort((a, b) => {
				// Sort version by date (most recent on top)
				return b.date - a.date;
			});

			if (monitor.versions.length <= 0 || newest != monitor.versions[0].label) {
				// Is a new version
				this.addVersion(monitor._id, newest, new Date());
			}
		} catch (err) {
			this.editError(monitor._id, err);
		}
	}

	checkAll() {
		for (const [, monitor] of MonitorsCollection.fetch()) {
			this.check(monitor);
		}
	}
}
