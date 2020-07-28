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
import ListMonitor from "./components/ListMonitor.jsx";

const ENDPOINT = process.env.ENDPOINT || window.location.origin;

const toastr_option = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "7000",
  "extendedTimeOut": "2000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

class App extends Component {
  constructor(props) {
		super(props);
		
		Model.setEndpoint(ENDPOINT);

		const monitors_load = Model.loadMonitorSync();
		const preferences = Model.loadPreferencesSync();

    this.state = {
      monitors: monitors_load ? monitors_load : new Map(),
      filter: "",
			theme: preferences.theme ? preferences.theme : "light",
			unsave: preferences.unsave ? preferences.unsave : false
    };

    this.setTheme();

    this.createMonitor = this.createMonitor.bind(this);
    this.editMonitor = this.editMonitor.bind(this);
    this.deleteMonitor = this.deleteMonitor.bind(this);
    this.saveMonitors = this.saveMonitors.bind(this);
    this.savePreferences = this.savePreferences.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
		this.setTheme = this.setTheme.bind(this);
		this.setUnsave = this.setUnsave.bind(this);
    this.loadMonitorsFromServer = this.loadMonitorsFromServer.bind(this);
    this.loadMonitorsFromClient = this.loadMonitorsFromClient.bind(this);
    this.saveMonitorsToClient = this.saveMonitorsToClient.bind(this);
    this.saveMonitorsToServer = this.saveMonitorsToServer.bind(this);
  }

  createMonitor(monitor) {
    this.editMonitor(monitor);
  }

  editMonitor(monitor) {
    this.state.monitors.set(monitor.hash, monitor);
    this.saveMonitors();
    this.forceUpdate();
  }

  deleteMonitor(monitor) {
    this.state.monitors.delete(monitor.hash);
    this.saveMonitors();
    this.forceUpdate();
  }

  saveMonitors() {
		this.setUnsave(true);
    Model.saveMonitors(this.state.monitors);
	}
	
	savePreferences() {
		Model.savePreferences({theme: this.state.theme, unsave: this.state.unsave});
	}

  setFilter(nfilter) {
    this.setState({
      filter: nfilter,
    });
  }

  toggleTheme() {
    this.setState({
      theme: this.state.theme === "light" ? "dark" : "light",
    });
  }

  setTheme() {
		this.savePreferences();
    document.querySelector("html").setAttribute("theme", this.state.theme);
	}
	
	setUnsave(bool) {
		this.setState({
			unsave: bool
		});
	}

  async saveMonitorsToClient() {
		const json = await Model.makeJsonOfMonitors(this.state.monitors);
		const blob = new Blob([json], { type: "data:text/json;charset=utf-8" });
		const link = URL.createObjectURL(blob);
		let a = document.createElement("a");
		a.download = "Monitors.json";
		a.href = link;
		document.body.appendChild(a);
		a.click();
		a.remove();
		this.setUnsave(false);
  }

  async saveMonitorsToServer() {
		try {
			Model.setConfToServ(this.state.monitors);
			this.setUnsave(false);
			Toastr.success("The monitor configuration was set correctly on the server.", "Saved !", toastr_option);
		}
		catch (e) {
			console.error(e);
			Toastr.error(`Error: ${e}`, "An error has occurred!", toastr_option);
		}
		
  }

  async loadMonitorsFromClient(event) {
		const file = event.target.files[0];
		const reader = new window.FileReader();
		reader.onload = (event) => {
			try {
				const nmonitors = Model.makeMonitorsFromJson(event.target.result);
				this.setState({
					monitors: nmonitors
				});
				Toastr.success("The monitor configuration was loaded correctly from the client.", "Loaded !", toastr_option);
			}
			catch(e) {
				console.error(e);
				Toastr.error(`Error: ${e}`, "An error has occurred!", toastr_option);
			}
		};
		reader.readAsText(file);
  }

  async loadMonitorsFromServer() {
		try {
			const json = await Model.getConfFromServ();
			this.setState({
				monitors: Model.makeMonitorsFromJson(json)
			});
			Toastr.success("The monitor configuration was loaded correctly from the server.", "Loaded !", toastr_option);
		}
		catch(e) {
			console.error(e);
			Toastr.error(`Error: ${e}`, "An error has occurred!", toastr_option);
		}
  }

  componentDidUpdate(prevState) {
    if (prevState.theme !== this.state.theme) this.setTheme();
  }

  render() {
    return (
      <div className="uk-container">
        <Menu
          setFilter={this.setFilter}
          createMonitor={this.createMonitor}
          dark_theme={this.state.theme == "dark"}
					toggleTheme={this.toggleTheme}
					unsave={this.state.unsave}
					loadMonitorsFromServer = {this.loadMonitorsFromServer}
					loadMonitorsFromClient = {this.loadMonitorsFromClient}
					saveMonitorsToClient = {this.saveMonitorsToClient}
					saveMonitorsToServer = {this.saveMonitorsToServer}
        />
        <ListMonitor
          monitors={this.state.monitors}
          filter={this.state.filter}
          deleteMonitor={this.deleteMonitor}
          editMonitor={this.editMonitor}
          saveMonitors={this.saveMonitors}
        />
      </div>
    );
  }
}

UIkit.use(Icons);
library.add(fas, far);
dom.watch();
ReactDom.render(<App />, document.querySelector(".app"));
