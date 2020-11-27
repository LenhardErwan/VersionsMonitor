import React, { Component } from "react";
import ReactDom from "react-dom";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import * as Toastr from "toastr";

import Model from "./Model.js";
import Menu from "./components/Menu.jsx";
import MonitorList from "./components/MonitorList.jsx";
import Monitor from "../templates/monitor"

const ENDPOINT = process.env.ENDPOINT || window.location.origin;
Model.endpoint = ENDPOINT;

const toastr_options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "10000",
  extendedTimeOut: "2000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

class App extends Component {
  constructor(props) {
    super(props);

		let preferences = Model.loadFromStorage("preferences");
		if(!preferences) preferences = {theme: "light", display: "list"};

    this.state = {
      monitors: new Map(),
      filter: "",
			preferences: preferences
		};
		
		//TODO inError on load
		Model.getMonitors()
      .then((monitors) => {
        this.setState({
          monitors: monitors,
        });
      })
      .catch((err) => {
				console.error(err);
				iToastr.error(err.msg, "Error loading monitors", toastr_options);
      });

    this.setTheme();

    this.createMonitor = this.createMonitor.bind(this);
    this.editMonitor = this.editMonitor.bind(this);
		this.deleteMonitor = this.deleteMonitor.bind(this);
		this.checkMonitor = this.checkMonitor.bind(this);
		this.reloadMonitor = this.reloadMonitor.bind(this);
		this.manageHeaders = this.manageHeaders.bind(this);
		this.createHeader = this.createHeader.bind(this);
		this.editHeader = this.editHeader.bind(this);
		this.deleteHeader = this.deleteHeader.bind(this);
    this.savePreferences = this.savePreferences.bind(this);
		this.setFilter = this.setFilter.bind(this);
		this.toggleDisplay = this.toggleDisplay.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
		this.setTheme = this.setTheme.bind(this);

		this.fctMonitor = {
			create: this.createMonitor,
			edit: this.editMonitor,
			delete: this.deleteMonitor,
			reload: this.reloadMonitor,
			check: this.checkMonitor
		}

		this.fctHeader = {
			create: this.createHeader,
			edit: this.editHeader,
			delete: this.deleteHeader
		}
  }

   async createMonitor(param, show_success = true) {
		try {
			const data = await Model.createMonitor(param);
			if(data.success) {
				let monitor = data.posted;
				if(param.headers && Object.keys(param.headers).length > 0) {
					await this.manageHeaders(monitor.id, param.headers);
				}
				monitor.versions = data.posted.versions
				this.state.monitors.set(monitor.id, monitor);
				this.forceUpdate();
				if(show_success) if(show_success) Toastr.success(`Monitor \"${monitor.name}\" has been created`, `Monitor created - ${monitor.name}`, toastr_options);
			}
			return data.success;
		}
		catch(err) {
			console.error(err);
			if(err.data.posted) {
				let monitor = new Monitor(err.data.posted);
				monitor.inError = true;
				this.state.monitors.set(monitor.id, monitor);
				this.forceUpdate();
				if(show_success) Toastr.warning(`Monitor \"${monitor.name}\" has been created with error:\n"${err.msg}"`, `Monitor created - ${monitor.name}`, toastr_options);
			}
			else {
				iToastr.error(err.msg, "Error when creating monitor", toastr_options);
			}
			return false
		}
	}

  async editMonitor(id, params, show_success = true) {
		try {
			let needCheck = false;
			if(params.headers && params.headers.size > 0) {
				await this.manageHeaders(id, params.headers);
				needCheck = true;
			}
			if((Object.keys(params).length > 1 && params.headers) || (Object.keys(params).length > 0 && !params.headers)) {
				const data = await Model.updateMonitor(id, params);
				if(data.success) {
					needCheck = false;
					let monitor = this.state.monitors.get(id);
					for (const key in params) {
						if(key != "headers") monitor[key] = params[key];
					}
					monitor.versions = data.updated.versions
					monitor.inError = false;
					this.state.monitors.set(id, monitor);
					this.forceUpdate();
					if(show_success) Toastr.success(`Monitor \"${monitor.name}\" has been updated`, `Monitor updated - ${monitor.name}`, toastr_options);
				}
				else {
					throw data.error;
				}
				return data.success;
			}
			if(needCheck) {
				await Model.checkMonitor(id);
				const monitor = await Model.getMonitor(id);
				monitor.inError = false;
				this.state.monitors.set(id, monitor);
				this.forceUpdate();
				if(show_success) Toastr.success(`Monitor \"${monitor.name}\" has been updated`, `Monitor updated - ${monitor.name}`, toastr_options);
			}
		}
		catch(err) {
			console.error(err);
			if(err.data.updated) {
				let monitor = new Monitor(err.data.updated);
				monitor.inError = true;
				this.state.monitors.set(monitor.id, monitor);
				this.forceUpdate();
				if(show_success) Toastr.warning(`Monitor \"${monitor.name}\" has been updated with error:\n"${err.msg}"`, `Monitor updated - ${monitor.name}`, toastr_options);
			}
			else {
				const monitor = this.state.monitors.get(id);
				monitor.inError = true;
				iToastr.error(err.msg, `Error when updating monitor - ${monitor.name}`, toastr_options);
			}
			return false
		}
	}

  async deleteMonitor(id, show_success = true) {
		try {
			const data = await Model.deleteMonitor(id);
			if(data.success) {
				this.state.monitors.delete(data.deleted.id);
				this.forceUpdate();
				if(show_success) Toastr.success(`Monitor \"${data.deleted.name}\" has been deleted`, `Monitor deleted - ${data.deleted.name}`, toastr_options);
			}
			return data.success;
		}
		catch(err) {
			console.error(err)
			iToastr.error(err.msg, `Error when deleting monitor - ${this.state.monitors.get(id).name}`, toastr_options);
			return false
		}
	}

	async manageHeaders(monitor_id, headers) {
		let nheaders = this.state.monitors.get(monitor_id).headers;
		for (const [id, header] of headers) {
			if(id > 0) { //Edit
				if(header.check) {	//Must be linked
					if(!header.checked) {	//Was not linked
						try {
							const res = await Model.linkHeaderToMonitor(monitor_id, id);
							nheaders.set(id, {id: id, title: header.title, value: header.value});
						}
						catch (err) {
							console.log(err)
							if(err.code == 500) {
								nheaders.set(id, {id: id, title: header.title, value: header.value});
							}
							throw err;
						}
					}
				}
				else {	//Must not be linked 
					if(header.checked) {	//Was linked
						try {
							const res = await Model.unlinkHeaderToMonitor(monitor_id, id);
							nheaders.delete(id);
							this.forceUpdate();
						}
						catch (err) {
							console.log(err)
							if(err.code == 500) {
								nheaders.delete(id);
							}
							throw err;
						}
					}
				}
			}
			else { //Create
				if(header.check) {	//Must be linked
					try {
						const res = await Model.createAndLinkHeader(monitor_id, {title: header.title, value: header.value});
						nheaders.set(res.posted.id, res.posted);
					}
					catch (err) {
						console.log(err)
						if(err.code == 500) {
							nheaders.set(res.posted.id, res.posted);
						}
						throw err;
					}
				}
				else { //Must not be linked
					try {
						await Model.createHeader({title: header.title, value: header.value});
					}
					catch (err) {
						throw err;
					}
				}
			}
		}
		this.forceUpdate();
	}

	async createHeader(param) {
		try {
			const data = await Model.createHeader(param);
			if(data.success) {
				return data.posted;
			}
			return data.success;
		}
		catch(err) {
			console.error(err)
			return false
		}
	}

	async editHeader(header_id, param) {
		try {
			const data = await Model.updateHeader(header_id, param);
			if(data.success) {
				let nheader = data.updated;
				for (const [key, monitor] of this.state.monitors) {
					if(monitor.headers.has(nheader.id)) monitor.headers.set(nheader.id, nheader);
				}
				this.forceUpdate();
			}
			return data.success;
		}
		catch(err) {
			console.error(err)
			return false
		}
	}

	async deleteHeader(monitor_id, header_id, show_success = true) {
		try {
			const data = await Model.deleteHeader(header_id);
			if(data.success) {
				this.state.monitors.get(monitor_id).headers.delete(data.deleted.id);
				if(show_success) Toastr.success("Header correctly deleted", "Delete", toastr_options);
				this.forceUpdate();
			}
			return data.success;
		}
		catch(err) {
			console.error(err)
			throw err;
		}
	}

	async checkMonitor(id, show_success = true) {
		try {
			await Model.checkMonitor(id);
			if(show_success) Toastr.success(`Monitor \"${monitor.name}\" has been checked`, "Monitor checked", toastr_options);
			return true;
    } catch (err) {
			this.state.monitors.get(id).inError = true;
			this.forceUpdate();
      console.error(err);
			iToastr.error(err.msg, "Error when check monitor", toastr_options);
			return false;
    }
	}

	async reloadMonitor(id, show_success = true) {
		try {
			const monitor = await Model.getMonitor(id);
			this.state.monitors.set(id, monitor);
			this.forceUpdate();
			if(show_success) Toastr.success(`Monitor \"${monitor.name}\" has been reloaded`, "Monitor reloaded", toastr_options);
			return true;
		} catch (err) {
			this.state.monitors.get(id).inError = true;
			this.forceUpdate();
      console.error(err);
			iToastr.error(err.msg, "Error when reload monitor", toastr_options);
			return false
    }
	}

  savePreferences() {
    Model.saveInStorage("preferences", this.state.preferences);
  }

  setFilter(nfilter) {
    this.setState({
      filter: nfilter
    });
  }

  toggleTheme() {
		this.state.preferences.theme = this.state.preferences.theme === "light" ? "dark" : "light";
    this.forceUpdate();
		this.setTheme();
	}
	
	toggleDisplay() {
		this.state.preferences.display = this.state.preferences.display === "grid" ? "list" : "grid";
		this.forceUpdate();
		this.savePreferences();
	}

  setTheme() {
    this.savePreferences();
		document.querySelector("html").setAttribute("theme", this.state.preferences.theme);
  }

  render() {
    return (
      <div className="uk-container">
        <Menu
          setFilter={this.setFilter}
          createMonitor={this.createMonitor}
          preferences={this.state.preferences}
					toggleTheme={this.toggleTheme}
					toggleDisplay={this.toggleDisplay}
        />
        <MonitorList
          monitors={this.state.monitors}
					filter={this.state.filter}
					display_method={this.state.preferences.display}
					fctMonitor={this.fctMonitor}
					fctHeader={this.fctHeader}
        />
      </div>
    );
  }
}

UIkit.use(Icons);
library.add(fas, far);
dom.watch();
ReactDom.render(<App />, document.querySelector(".app"));
