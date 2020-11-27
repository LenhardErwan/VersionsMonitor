import React, { Component } from "react";
import * as Toastr from "toastr";
import {Img} from "react-image";

import MonitorEditor from "./MonitorEditor.jsx";
import MonitorView from "./MonitorView.jsx";

import noImage from "../../images/no_image.svg"

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

export default class MonitorItem extends Component {
  constructor(props) {
		super(props);

    this.state = {
			id: this.props.monitor.id,
			name: this.props.monitor.name,
			url: this.props.monitor.url,
			selector: this.props.monitor.selector,
			regex: this.props.monitor.regex,
			last_know_version: this.props.monitor.last_know_version,
			image: this.props.monitor.image,
			headers: this.props.monitor.headers,
			versions: this.props.monitor.versions,
			inError: this.props.monitor.inError
		};

		this.handleDeleteMonitor = this.handleDeleteMonitor.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.deleteHeader = this.deleteHeader.bind(this);
		this.openTab = this.openTab.bind(this);
		this.getIcon = this.getIcon.bind(this);
		this.getVersionString = this.getVersionString.bind(this);
		this.getDateString = this.getDateString.bind(this);
	}
	
	handleDeleteMonitor() {
		this.props.fctMonitor.delete(this.state.id);
	}

 handleEdit(nparams) {
		let whatDifferent = {};
		if(this.state.name != nparams.name) whatDifferent.name = nparams.name;
		if(this.state.url != nparams.url) whatDifferent.url = nparams.url;
		if(this.state.selector != nparams.selector) whatDifferent.selector = nparams.selector;
		if(this.state.regex != nparams.regex) whatDifferent.regex = nparams.regex;
		if(this.state.image != nparams.image_url) whatDifferent.image = nparams.image_url;
		if(nparams.new_headers) whatDifferent.headers = nparams.new_headers;
		this.props.fctMonitor.edit(nparams.id, whatDifferent)
			.then( ()=> {
				this.forceUpdate();
			})
			.catch((err) => {
				console.error(err);
			})
	}

	async handleRefresh() {
		const resCheck = await this.props.fctMonitor.check(this.state.id, false);
		if(resCheck) {
			const resReload = await this.props.fctMonitor.reload(this.state.id, false);
			if(resReload) {
				Toastr.success(`Monitor \"${this.state.name}\" has been refreshed`, "Monitor refreshed", toastr_options);
			}
		}
  }

	async openTab() {
		window.open(this.state.url, '_blank');
	}

	deleteHeader(id) {
		this.props.fctHeader.delete(this.state.id, id);
	}
  
  componentDidUpdate(prevProps, prevState) {
    if(this.props !== prevProps) {
      this.setState({
				name: this.props.monitor.name,
				url: this.props.monitor.url,
				selector: this.props.monitor.selector,
				regex: this.props.monitor.regex,
				image: this.props.monitor.image,
				headers: this.props.monitor.headers,
				versions: this.props.monitor.versions,
				inError: this.props.monitor.inError
			});
		}
	}

	getIcon(src_list) {
		const {src} = useImage({
			srcList: src_list
		});
	 
		return <img src={src} />
	}

	getActionsButton() {
		return(
			<div>
				<button className="uk-button icon-button" uk-toggle={`target: #view-modal-${this.state.id}`} uk-tooltip="title: View monitor"><i className="fas fa-eye"></i></button>
				<div id={`view-modal-${this.state.id}`} className="uk-flex-top" uk-modal="true">
					<MonitorView {...this.state} handleRefresh={this.handleRefresh} reload={this.props.fctMonitor.reload}/>
				</div>
				<button className="uk-button icon-button" onClick={this.handleRefresh} uk-tooltip="title: Refresh monitor"><i className="fas fa-sync-alt"></i></button>
				<button className="uk-button icon-button" uk-toggle={`target: #edit-modal-${this.state.id}`} uk-tooltip="title: Edit monitor"><i className="fas fa-edit"></i></button>
				<div id={`edit-modal-${this.state.id}`} className="uk-flex-top" uk-modal="true">
					<MonitorEditor {...this.state} type="Edit" show_advance={false} handleEdit={this.handleEdit} editHeader={this.props.fctHeader.edit} deleteHeader={this.deleteHeader} />
				</div>
				<button className="uk-button icon-button" uk-toggle={`target: #delete-modal-${this.state.id}`} uk-tooltip="title: Delete monitor"><i className="fas fa-trash-alt"></i></button>
				<div id={`delete-modal-${this.state.id}`} className="uk-flex-top" uk-modal="true">
					<div className="uk-modal-dialog uk-margin-auto-vertical">
						<div className="uk-modal-header">
							<h4 className="uk-modal-title">Are you sure to delete <i>{this.state.name}</i> ?</h4>
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
			</div>
		);
	}

	getVersionString() {
		let str;
		if(this.state.versions.length > 0) {
			str = this.state.versions[0].value;
		}
		else if(this.state.inError) {
			str = "Error";
		}
		else {
			str = "No version";
		}
		return str;
	}

	getDateString() {
		let str;
		if(this.state.versions.length > 0) {
			str = new Date(this.state.versions[0].discovery_timestamp).toLocaleString();
		}
		else if(this.state.inError) {
			str = "Error";
		}
		else {
			str = "No version";
		}
		return str;
	}

  render() {
		if(this.props.display_method == "grid") {
			return (
				<article className={`monitor uk-animation-slide-bottom-small uk-card uk-card-default uk-card-body ${this.state.inError ? "monitor-in-error" : ""}`}>
					<Img src={[this.state.image, `${new URL(this.state.url).origin}/favicon.ico`, noImage]} />
					<div><span>{this.state.name}</span></div>
					<div>Newest version: <span className="newest_version">{this.getVersionString()}</span></div>
					<div>Discovery date: <span className="newest_discovery">{this.getDateString()}</span></div>
					<div>Download: <a href={this.state.url} uk-tooltip={`title: Open the following link in a new tab: ${this.state.url}`} onClick={(event) => {event.preventDefault(); const win = window.open(this.state.url, '_blank'); win.focus();}}>Link</a></div>
					{this.getActionsButton()}
				</article>
			);
		}
		else {
			return (
				<tr key={this.state.id} className={`${this.state.inError ? "monitor-in-error" : ""}`}>
					<td><Img src={[this.state.image, `${new URL(this.state.url).origin}/favicon.ico`, noImage]} /></td>
					<td>{this.state.name}</td>
					<td>{this.getVersionString()}</td>
					<td>{this.getDateString()}</td>
					<td><a href={this.state.url} onClick={(event) => {event.preventDefault(); const win = window.open(this.state.url, '_blank'); win.focus();}}>Link</a></td>
					<td>{this.getActionsButton()}</td>
				</tr>
			);
		}
  }
}
