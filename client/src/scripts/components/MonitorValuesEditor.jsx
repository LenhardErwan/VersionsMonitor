import React, { Component } from "react";
import * as Toastr from "toastr";

import HeadersEditor from "./HeadersEditor.jsx";
import UIkit from "uikit";

const toastr_options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-center",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "500",
  timeOut: "10000",
  extendedTimeOut: "2000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

export default class MonitorValuesEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id ? this.props.id : "",
			name: this.props.name ? this.props.name : "",
			url: this.props.url ? this.props.url : "",
			selector: this.props.selector ? this.props.selector : "",
			regex: this.props.regex ? this.props.regex : "",
			image_url: this.props.image_url ? this.props.image_url : "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getValues() {
		let obj = {}
		for (const key in this.state) {
			if(this.state[key].length <= 0) obj[key] = null;
			else obj[key] = this.state[key]
		}
    return obj;
  }

  handleInputChange(event) {
    let nparams = this.state;
    nparams[event.target.name] = event.target.value;
    this.setState(nparams);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
				id: this.props.id ? this.props.id : "",
        name: this.props.name ? this.props.name : "",
        url: this.props.url ? this.props.url : "",
        selector: this.props.selector ? this.props.selector : "",
        regex: this.props.regex ? this.props.regex : "",
        image_url: this.props.image_url ? this.props.image_url : "",
        last_know_version: this.props.last_know_version
          ? this.props.last_know_version
          : ""
      });
    }
  }

  render() {
    return (
      <div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="name">
            Name:<span>*</span>
          </label>
          <div className="uk-form-controls">
            <input
              type="text"
              name="name"
              className="uk-input"
              placeholder="Application's name..."
              onChange={this.handleInputChange}
              value={this.state.name}
              required
            ></input>
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="url">
            URL:<span>*</span>
          </label>
          <div className="uk-form-controls">
            <input
              type="text"
              name="url"
              className="uk-input"
              placeholder="Link to the version..."
              onChange={this.handleInputChange}
              value={this.state.url}
              required
            ></input>
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="selector">
            Selector:<span>*</span>
          </label>
          <div className="uk-form-controls">
            <input
              type="text"
              name="selector"
              className="uk-input"
              placeholder="CSS selector to the version..."
              onChange={this.handleInputChange}
              value={this.state.selector}
              required
            ></input>
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="regex">
            Regex:
          </label>
          <div className="uk-form-controls">
            <input
              type="text"
              name="regex"
              className="uk-input"
              placeholder="Regex to refine the result..."
              onChange={this.handleInputChange}
              value={this.state.regex}
            ></input>
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="image_url">
            Image URL:
          </label>
          <div className="uk-form-controls">
            <input
              type="text"
              name="image_url"
              className="uk-input"
              placeholder="Link to application's logo"
              onChange={this.handleInputChange}
              value={this.state.image_url}
            ></input>
          </div>
        </div>
      </div>
    );
  }
}
