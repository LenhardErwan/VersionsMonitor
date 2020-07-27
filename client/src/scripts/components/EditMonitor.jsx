import React, { Component } from "react";
import Model from "../Model"
import sha256 from 'crypto-js/sha256';
import * as Toastr from "toastr";

import HeadersEditor from "./HeadersEditor.jsx"
import UIkit from "uikit";

const toastr_options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "500",
  "timeOut": "10000",
  "extendedTimeOut": "2000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

export default class EditMonitor extends Component {
  constructor(props) {
		super(props);
		
		//TODO Add test button

    this.state = {
			params: {
				name: this.props.name ? this.props.name : "",
				url: this.props.url ? this.props.url : "",
				selector: this.props.selector ? this.props.selector : "",
				regex: this.props.regex ? this.props.regex : "",
				your_version: this.props.your_version ? this.props.your_version : "",
				image_url: this.props.image_url ? this.props.image_url : "",
				headers: this.props.headers ? this.props.headers : new Map(),
				last_know_version: this.props.last_know_version ? this.props.last_know_version : "",
				hash: this.props.hash ? this.props.hash : ""
			},
			show_advance: false
		};

		this.handleEdit = this.props.handleEdit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setHeaders = this.setHeaders.bind(this);
		this.child = React.createRef();
	}

	handleSubmit(event) {
		event.preventDefault();
		if(this.state.params.name == "" || this.state.params.url == "" || this.state.params.selector == "") {
			Toastr.error("As a minimum, the monitor needs a name, a valid URL and a selector.", "Error in form!", toastr_options);
		}
		else {
			try {
				const url = new URL(this.state.params.url);
			} catch (e) {
				Toastr.error("the URL entered is not valid, please check it!", "Error in URL!", toastr_options);
				return;
			}
			if(this.state.params.image_url == "") this.state.params.image_url = this.state.params.url;
			if(this.state.params.hash == "") this.state.params.hash = sha256(new Date().getTime()+this.state.params.name).toString();
			if(this.child.current) this.child.current.handleSubmit();
			this.handleEdit({...this.state.params});
			if(this.props.type.toLowerCase() == "create") {
				UIkit.modal(`#create-modal`).hide();
			}
			else {
				UIkit.modal(`#edit-modal-${this.state.params.hash}`).hide();
			}
		}
	}

	handleInputChange(event) {
		let nparams = this.state.params;
		nparams[event.target.name] = event.target.value
    this.setState({
			params: nparams
		});
	}
	
	setHeaders(headers_map) {
		let nparams = this.state.params;
		nparams.headers = headers_map;
    this.setState({
			params: nparams
		});
	}

	componentDidUpdate(prevProps) {
		if(prevProps !== this.props) {
			this.setState({
				params: {
					name: this.props.name ? this.props.name : "",
					url: this.props.url ? this.props.url : "",
					selector: this.props.selector ? this.props.selector : "",
					regex: this.props.regex ? this.props.regex : "",
					your_version: this.props.your_version ? this.props.your_version : "",
					image_url: this.props.image_url ? this.props.image_url : "",
					headers: this.props.headers ? this.props.headers : new Map(),
					last_know_version: this.props.last_know_version ? this.props.last_know_version : "",
					hash: this.props.hash ? this.props.hash : ""
				},
				show_advance: false
			});
		}
	}

  render() {
    return (
      <article className="uk-modal-dialog uk-margin-auto-vertical">
				<div className="uk-modal-header">
					<h2>{this.props.type} monitor</h2>
					<button className="uk-modal-close-default" type="button" uk-close="true"></button>
				</div>
				<div className="uk-modal-body">
					<form className="uk-form-stacked" onSubmit={this.handleSubmit}>
						<div className="uk-margin">
							<label className="uk-form-label" htmlFor="name">Name:<span>*</span></label>
							<div className="uk-form-controls">
								<input type="text" name="name" className="uk-input" placeholder="Application's name..." onChange={this.handleInputChange} value={this.state.params.name} required></input>
							</div>
						</div>
						<div className="uk-margin">
							<label className="uk-form-label" htmlFor="url">URL:<span>*</span></label>
							<div className="uk-form-controls">
								<input type="text" name="url" className="uk-input" placeholder="Link to the version..." onChange={this.handleInputChange} value={this.state.params.url} required></input>
							</div>
						</div>
						<div className="uk-margin">
							<label className="uk-form-label" htmlFor="selector">Selector:<span>*</span></label>
							<div className="uk-form-controls">
								<input type="text" name="selector" className="uk-input" placeholder="CSS selector to the version..." onChange={this.handleInputChange} value={this.state.params.selector} required></input>
							</div>
						</div>
						<div className="uk-margin">
							<label className="uk-form-label" htmlFor="regex">Regex:</label>
							<div className="uk-form-controls">
								<input type="text" name="regex" className="uk-input" placeholder="Regex to refine the result..." onChange={this.handleInputChange} value={this.state.params.regex}></input>
							</div>
						</div>
						<div className="uk-margin">
							<label className="uk-form-label" htmlFor="your_version">Your version:</label>
							<div className="uk-form-controls">
								<input type="text" name="your_version" className="uk-input" placeholder="Your Version" onChange={this.handleInputChange} value={this.state.params.your_version}></input>
							</div>
						</div>
						<div className="uk-margin">
							<label className="uk-form-label" htmlFor="image_url">Image URL:</label>
							<div className="uk-form-controls">
								<input type="text" name="image_url" className="uk-input" placeholder="Link to application's logo" onChange={this.handleInputChange} value={this.state.params.image_url}></input>
							</div>
						</div>
					</form>
					{this.state.show_advance && 
						<HeadersEditor headers={this.state.params.headers} setHeaders={this.setHeaders} ref={this.child}/>
					}
				</div>
				<div className="uk-modal-footer uk-text-right">
					<button className="uk-button uk-button-default uk-modal-close" >Cancel</button>
					<button className="uk-button uk-button-secondary" onClick={() => {this.setState({show_advance: !this.state.show_advance})}}>Advanced</button>
					<button className="uk-button uk-button-primary" type="submit" onClick={this.handleSubmit}>Save</button>
				</div>
      </article>
    );
  }
}
