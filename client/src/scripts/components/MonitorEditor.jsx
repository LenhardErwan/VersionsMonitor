import React, { Component } from "react";
import * as Toastr from "toastr";
import UIkit from "uikit";
import { Img } from "react-image";

import ValuesEditor from "./MonitorValuesEditor.jsx";
import HeadersEditor from "./HeadersEditor.jsx";
import noImage from "../../images/no_image.svg";

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

export default class MonitorEditor extends Component {
  constructor(props) {
		super(props);
		
		//TODO Add test button

    this.state = {
			params: {
				id: this.props.id,
				name: this.props.name,
				url: this.props.url,
				selector: this.props.selector,
				regex: this.props.regex,
				image_url: this.props.image,
				headers: this.props.headers ? this.props.headers : new Map()
			},
			show_advance: this.props.show_advance ? this.props.show_advance : false
		};

		this.handleEdit = this.props.handleEdit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.headersEditor = React.createRef();
		this.valuesEditor = React.createRef();
	}

	handleSubmit(event) {
		event.preventDefault();
		let params = this.valuesEditor.current.getValues();
		if(params.name == null || params.url == null || params.selector == null) {
			Toastr.error("As a minimum, the monitor needs a name, a valid URL and a selector.", "Error in form!", toastr_options);
		}
		else {
			try {
				const url = new URL(params.url);
			} catch (e) {
				Toastr.error("the URL entered is not valid, please check it!", "Error in URL!", toastr_options);
				return;
			}
			let new_headers = null
			if(this.headersEditor.current) {
				new_headers = this.headersEditor.current.handleSubmit();
			}
			console.log(params)
			this.handleEdit({...params, new_headers: new_headers});
			this.setState({show_advance: false});
			if(this.props.type.toLowerCase() == "create") {
				UIkit.modal(`#create-modal`).hide();
			}
			else {
				UIkit.modal(`#edit-modal-${this.state.params.id}`).hide();
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

	componentDidUpdate(prevProps) {
		if(prevProps !== this.props) {
			this.setState({
				params: {
					id: this.props.id,
					name: this.props.name,
					url: this.props.url,
					selector: this.props.selector,
					regex: this.props.regex,
					image_url: this.props.image,
					headers: this.props.headers ? this.props.headers : new Map(),
					last_know_version: this.props.last_know_version
				},
				show_advance: this.state.show_advance
			});
		}
	}

  render() {
    return (
      <article className="uk-modal-dialog uk-margin-auto-vertical">
				<div className="uk-modal-header">
				<h2>{this.props.type} monitor - {this.props.name}</h2>
					<button className="uk-modal-close-default" type="button" uk-close="true"></button>
				</div>
				<div className="uk-modal-body">
					<form className="uk-form-stacked" onSubmit={this.handleSubmit}>
						<ValuesEditor {...this.props} ref={this.valuesEditor} />
					</form>
					{this.state.show_advance && 
						<HeadersEditor headers={this.props.headers} editHeader={this.props.editHeader} deleteHeader={this.props.deleteHeader} ref={this.headersEditor} />
					}
				</div>
				<div className="uk-modal-footer uk-text-right">
					<button className="uk-button uk-button-default uk-modal-close" onClick={() => {this.setState({show_advance: false})}}>Cancel</button>
					<button className="uk-button uk-button-secondary" onClick={() => {this.setState({show_advance: !this.state.show_advance})}}>Advanced</button>
					<button className="uk-button uk-button-primary" type="submit" onClick={this.handleSubmit}>Save</button>
				</div>
      </article>
    );
  }
}
