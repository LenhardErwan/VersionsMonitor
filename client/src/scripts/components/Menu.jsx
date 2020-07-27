import React, { Component } from "react";

import EditMonitor from "./EditMonitor.jsx"

export default class Menu extends Component {
  constructor(props) {
		super(props);

    this.state = {
			input_filter: "",
			monitors: this.props.monitors,
      showModal: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.createMonitor = this.props.createMonitor.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      input_filter: event.target.value,
		});
		this.props.setFilter(event.target.value);
  }

  handleOpenModal() {
    this.setState({
      showModal: true,
    });
  }

  handleCloseModal() {
    this.setState({
      showModal: false,
    });
	}
	
	handleEdit(params) {
		this.createMonitor(params);
	}

  render() {
    return (
      <header className="menu">
				<div className="uk-search uk-search-default">
					<span className="uk-search-icon-flip" uk-search-icon="true"></span>
					<input
						type="text"
						name="filter"
						className="uk-search-input"
						placeholder="Search..."
						onChange={this.handleInputChange}
						value={this.state.input_filter}
						uk-tooltip="title: Search by name; delay: 1000"
					></input>
				</div>
				<span className="spacer">|</span>
        <button className="uk-button icon-button" uk-toggle={`target: #create-modal`} uk-tooltip="title: Add new monitor"><i className="fas fa-plus-square"></i></button>
        <div id={`create-modal`} className="uk-flex-top" uk-modal="true">
          <EditMonitor type="Create" handleClose={this.handleCloseModal} handleEdit={this.createMonitor} />
        </div>
				<span className="spacer">|</span>
				<button onClick={this.props.loadMonitorsFromServer} className="uk-button icon-button" uk-tooltip="title: Load monitors configuration from server"><i className="fas fa-cloud-download-alt"></i></button>
				<button onClick={() => {document.querySelector("#file-input-monitors").click()}} className="uk-button icon-button" uk-tooltip="title: Load monitors configuration from file"><i className="fas fa-file-upload"></i></button>
				<input id="file-input-monitors" type="file" name="monitors-client" style={{display: "none"}} onChange={this.props.loadMonitorsFromClient}></input>
				<span className="spacer">|</span>
				<button onClick={this.props.saveMonitorsToServer} className="uk-button icon-button" uk-tooltip="title: Save monitors configuration to server"><i className="fas fa-cloud-upload-alt"></i></button>
				<button onClick={this.props.saveMonitorsToClient} className="uk-button icon-button" uk-tooltip="title: Save monitors configuration to file"><i className="fas fa-file-download"></i></button>
				<div className="switch" onClick={this.props.toggleTheme} uk-tooltip="title: Toggle theme; pos: bottom">
					<input type="checkbox" checked={this.props.dark_theme} onChange={() => {}}/>
					<span className="slider round"></span>
				</div>
				<button className="uk-button icon-button" uk-tooltip="title: Go to help" onClick={(event) => {event.preventDefault(); const win = window.open("https://github.com/LenhardErwan/VersionsMonitor#how-to-use-it", '_blank'); win.focus();}}><i className="fas fa-question-circle"></i></button>
      </header>
    );
  }
}
