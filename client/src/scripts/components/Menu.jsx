import React, { Component } from "react";

import MonitorEditor from "./MonitorEditor.jsx"

export default class Menu extends Component {
  constructor(props) {
		super(props);

    this.state = {
			input_filter: "",
			showModal: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
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
          <MonitorEditor type="Create" handleClose={this.handleCloseModal} handleEdit={this.props.createMonitor} />
        </div>
				{/* TODO Download CSV file */}
				<div className="display-method">
					<button onClick={this.props.toggleDisplay} style={{display: this.props.preferences.display == "grid" ? "block" : "none"}} className="uk-button icon-button" uk-tooltip="title: Change view to list"><i className="fas fa-list"></i></button>
					<button onClick={this.props.toggleDisplay} style={{display: this.props.preferences.display == "grid" ? "none" : "block"}}  className="uk-button icon-button" uk-tooltip="title: Change view to card"><i className="fas fa-th"></i></button>
				</div>
				<div className="switch" onClick={this.props.toggleTheme} uk-tooltip="title: Toggle theme; pos: bottom">
					<input type="checkbox" checked={this.props.preferences.theme == "dark"} onChange={() => {}}/>
					<span className="slider round"></span>
				</div>
				<span className="spacer">|</span>
				<button className="uk-button icon-button" uk-tooltip="title: Go to help" onClick={(event) => {event.preventDefault(); const win = window.open("https://github.com/LenhardErwan/VersionsMonitor#how-to-use-it", '_blank'); win.focus();}}><i className="fas fa-question-circle"></i></button>
      </header>
    );
  }
}
