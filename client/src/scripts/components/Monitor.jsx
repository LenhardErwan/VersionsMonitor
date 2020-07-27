import React, { Component } from "react";

import Model from "../Model.js";
import EditMonitor from "./EditMonitor.jsx";

import * as Toastr from "toastr";

const toastr_options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "30000",
  "extendedTimeOut": "5000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

export default class Monitor extends Component {
  constructor(props) {
		super(props);

    this.state = {
			params: {
				name: this.props.params.name,
				url: this.props.params.url,
				selector: this.props.params.selector,
				regex: this.props.params.regex,
				last_know_version: this.props.params.last_know_version,
				your_version: this.props.params.your_version,
				image_url: this.props.params.image_url,
				hash: this.props.params.hash,
				headers: this.props.params.headers
			},
			newest_version: "",
		};

		this.last_request = new Date(0);

		this.handleDeleteMonitor = this.handleDeleteMonitor.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.checkVersion = this.checkVersion.bind(this);
		this.openTab = this.openTab.bind(this);
		
		this.checkVersion();
		setInterval(this.checkVersion, 43200000) //12H
	}
	
	handleDeleteMonitor() {
		this.props.deleteMonitor(this.state.params);
	}

	handleEdit(nparams) {
		this.last_request = new Date(0);
		this.setState({
			params: nparams
		});
	}

	async setNewest() {
		if(new Date() >= Model.addMinutes(this.last_request, 5) ) {
			try {
				const newest = await Model.getNewest(this.state.params.url, this.state.params.selector, this.state.params.regex, this.state.params.headers);
				this.last_request = new Date();
				this.setState({
					newest_version: newest
				});
				return newest;
			}
			catch(e) {
				console.error(e);
				this.setState({
					newest_version: `Error! check given parameters or your connection. (more info in console)`
				});
			}
		}
	}

	async checkVersion() {
		const newest = await this.setNewest();
		if(newest != this.state.params.last_know_version && !newest.includes("Error")) {
			if(this.state.params.last_know_version != "") Toastr.info("Click Me to open the download page", `A new version of <span class="app_name">${this.state.params.name}</span> is available`, toastr_options).on("click", this.openTab);
			this.state.params.last_know_version = newest;
			this.setState({
				params: {...this.state.params}
			});
		}
	}

	async openTab() {
		window.open(this.state.params.url, '_blank');
	}
  
  componentDidUpdate(prevProps, prevState) {
    if(this.props !== prevProps) {
      this.setState({params: this.props.params});
		}
		if(prevState.params !== this.state.params) {
			this.props.editMonitor(this.state.params);
			this.setNewest();
    }
	}

  render() {
    return (
      <article className="monitor uk-animation-slide-bottom-medium uk-card uk-card-default uk-card-body">
        <img src={this.state.params.url === this.state.params.image_url ? `${new URL(this.state.params.url).origin}/favicon.ico` : this.state.params.image_url} />
				<div><span>{this.state.params.name}</span></div>
				<div>Newest version: <span className="newest_version">{this.state.newest_version ? this.state.newest_version : `loadind...`}</span></div>
				<div>Your version: <span className="newest_version">{this.state.params.your_version}</span></div>
				<div><a href={this.state.params.url} uk-tooltip={`title: Open the following link in a new tab: ${this.state.params.url}`} onClick={(event) => {event.preventDefault(); const win = window.open(this.state.params.url, '_blank'); win.focus();}}>Link</a></div>
				<button className="uk-button icon-button" uk-toggle={`target: #edit-modal-${this.state.params.hash}`} uk-tooltip="title: Edit monitor"><i className="far fa-edit"></i></button>
        <div id={`edit-modal-${this.state.params.hash}`} className="uk-flex-top" uk-modal="true">
          <EditMonitor {...this.state.params} type="Edit" handleEdit={this.handleEdit} />
        </div>
        <button className="uk-button icon-button" uk-toggle={`target: #delete-modal-${this.state.params.hash}`} uk-tooltip="title: Delete monitor"><i className="far fa-trash-alt"></i></button>
				<div id={`delete-modal-${this.state.params.hash}`} className="uk-flex-top" uk-modal="true">
					<div className="uk-modal-dialog uk-margin-auto-vertical">
						<div className="uk-modal-header">
							<h4 className="uk-modal-title">Are you sure to delete <i>{this.state.params.name}</i> ?</h4>
							<button className="uk-modal-close-default" type="button" uk-close="true"></button>
						</div>
						<div className="uk-modal-body">
							<p>Be careful if you delete this item there will be no way to go back. You will have to re-create the element if you make the mistake of deleting it.</p>
						</div>
						<div className="uk-modal-footer uk-text-right">
							<button className="uk-button uk-button-default uk-modal-close" >Cancel</button>
							<button className="uk-button uk-button-danger uk-modal-close" onClick={this.handleDeleteMonitor}>Yes</button>
						</div>
					</div>
				</div>
      </article>
    );
  }
}
