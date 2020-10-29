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

    const preferences = Model.loadFromStorage("preferences");

    this.state = {
      monitors: new Map(),
      filter: "",
			preferences: {
				theme: preferences.theme ? preferences.theme : "light",
				display: preferences.display ? preferences.display : "list"
			}
		};
		
		Model.getMonitors()
      .then((monitors) => {
        this.setState({
          monitors: monitors,
        });
      })
      .catch((err) => {
				console.error(err);
				Toastr.error(err.msg, "Error loading monitors", toastr_options);
      });

    this.setTheme();

    this.createMonitor = this.createMonitor.bind(this);
    this.editMonitor = this.editMonitor.bind(this);
		this.deleteMonitor = this.deleteMonitor.bind(this);
		this.reloadMonitor = this.reloadMonitor.bind(this);
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
			reload: this.reloadMonitor
		}

		this.fctHeader = {
			create: this.createHeader,
			edit: this.editHeader,
			delete: this.deleteHeader
		}
  }

   async createMonitor(param) {
		try {
			const data = await Model.createMonitor(param);
			if(data.success) {
				let monitor = data.posted;
				if(param.headers) {
					await this.manageHeaders(id, param.headers);
				}
				monitor.versions = data.posted.versions
				this.state.monitors.set(monitor.id, monitor);
				this.forceUpdate();
				Toastr.success(`Monitor \"${monitor.name}\" has been created`, `Monitor created - ${monitor.name}`, toastr_options);
			}
			return data.success;
		}
		catch(err) {
			console.error(err);
			Toastr.error(err.msg, "Error when creating monitor", toastr_options);
			return false
		}
	}

  async editMonitor(id, param) {
		try {
			if(param.headers) {
				await this.manageHeaders(id, param.headers);
			}
			if((Object.keys(param).length > 1 && param.headers) || (Object.keys(param).length > 0 && !param.headers)) {
				const data = await Model.updateMonitor(id, param);
				if(data.success) {
					let monitor = this.state.monitors.get(id);
					for (const key in param) {
						if(key != "headers") monitor[key] = param[key];
					}
					monitor.versions = data.updated.versions
					monitor.inError = false;
					this.state.monitors.set(id, monitor);
					this.forceUpdate();
					Toastr.success(`Monitor \"${monitor.name}\" has been updated`, `Monitor updated - ${monitor.name}`, toastr_options);
				}
				else {
					throw data.error;
				}
				return data.success;
			}
		}
		catch(err) {
			console.error(err);
			Toastr.error(err.msg, `Error when updating monitor - ${this.state.monitors.get(id).name}`, toastr_options);
			this.state.monitors.get(id).inError = true;
			this.forceUpdate();
			return false
		}
	}

  async deleteMonitor(id) {
		try {
			const data = await Model.deleteMonitor(id);
			if(data.success) {
				this.state.monitors.delete(data.deleted.id);
				this.forceUpdate();
				Toastr.success(`Monitor \"${monitor.name}\" has been deleted`, `Monitor deleted - ${monitor.name}`, toastr_options);
			}
			return data.success;
		}
		catch(err) {
			console.error(err)
			Toastr.error(err.msg, `Error when deleting monitor - ${this.state.monitors.get(id).name}`, toastr_options);
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

	async deleteHeader(monitor_id, header_id) {
		try {
			const data = await Model.deleteHeader(header_id);
			if(data.success) {
				this.state.monitors.get(monitor_id).headers.delete(data.deleted.id);
				Toastr.success("Header correctly deleted", "Delete", toastr_options);
				this.forceUpdate();
			}
			return data.success;
		}
		catch(err) {
			console.error(err)
			throw err;
		}
	}

	async reloadMonitor(id) {
		const monitor = await Model.getMonitor(id);
		this.state.monitors.set(id, monitor);
		this.forceUpdate();
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
