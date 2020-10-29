import React, { Component } from "react";
import * as Toastr from "toastr";

import Model from "../Model";

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
  "timeOut": "5000",
  "extendedTimeOut": "2000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

//TODO Show unsave headers 

export default class HeadersEditor extends Component {
  constructor(props) {
		super(props);

		this.state = {
			headers_monitor: this.props.headers,
			headers: new Map()
		};

		this.createID = 0;
		
		Model.getHeaders()
			.then((headers) => {
				for (const [id, header] of headers) {
					header.checked = this.state.headers_monitor.has(id);
					header.check = header.checked;
				}
				this.setState({
					headers: headers
				});
			})
			.catch((err) => {
				console.error(err);
			});
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClickAdd = this.handleClickAdd.bind(this);
		this.getActionOption = this.getActionOption.bind(this);
	}

	handleChange(e, id) {
		const input = e.target;
		let header = this.state.headers.get(id);
		if(input.dataset.type === "check") header.check = !header.check;
		else header[input.dataset.type] = input.value;
		this.forceUpdate();
	}
	
	handleSubmit() {
		return this.state.headers;
	}

	handleClickAdd() {
		this.state.headers.set(this.createID, {id: this.createID--, title:"", value: "", check: true});
		this.forceUpdate();
	}

	handleUpdate(id) {
		const header = this.state.headers.get(id);
		this.props.editHeader(id, {title: header.title, value: header.value})
			.then((res) => {
				if(res) {
					Toastr.success("Header correctly saved", "Saved", toastr_options);
				}
			})
			.catch((err) => {
				Toastr.error(err, "Error on save", toastr_options);
			});
	}

	handleDelete(id) {
		if(id > 0) this.props.deleteHeader(id);
		else {
			this.state.headers.delete(id);
			this.forceUpdate();
		}
	}

	componentDidUpdate(prevProps) {
		if(prevProps != this.props) {
			this.setState({
				headers_monitor: this.props.headers,
				headers: new Map()
			});
	
			this.createID = 0;
			
			Model.getHeaders()
				.then((headers) => {
					for (const [id, header] of headers) {
						header.checked = this.state.headers_monitor.has(id);
						header.check = header.checked;
					}
					this.setState({
						headers: headers
					});
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}

	getActionOption(exist, superId, id) {
		if(exist) {
			return (
				<td>
					<button type="button" className="uk-button icon-button" uk-toggle={`target: #update-header-${superId}`}uk-tooltip="title: Update header"><i className="fas fa-save"></i></button>
					<div id={`update-header-${superId}`} className="uk-flex-top" uk-modal="stack: true">
						<div className="uk-modal-dialog uk-margin-auto-vertical">
							<div className="uk-modal-header">
								<h4 className="uk-modal-title">Are you sure to update this header ?</h4>
								<button className="uk-modal-close-default" type="button" uk-close="true"></button>
							</div>
							<div className="uk-modal-body">
								<p>Be careful if you update this item because <strong>ALL monitors linked to this header will also be updated</strong>.</p>
							</div>
							<div className="uk-modal-footer uk-text-right">
								<button className="uk-button uk-button-default uk-modal-close" >Cancel</button>
								<button className="uk-button uk-button-danger uk-modal-close" onClick={() => {this.handleUpdate(id)}}>Yes</button>
							</div>
						</div>
					</div>
					<button type="button" className="uk-button icon-button" uk-toggle={`target: #delete-header-${superId}`} uk-tooltip="title: Delete header"><i className="fas fa-trash-alt"></i></button>
					<div id={`delete-header-${superId}`} className="uk-flex-top" uk-modal="stack: true">
						<div className="uk-modal-dialog uk-margin-auto-vertical">
							<div className="uk-modal-header">
								<h4 className="uk-modal-title">Are you sure to delete this header ?</h4>
								<button className="uk-modal-close-default" type="button" uk-close="true"></button>
							</div>
							<div className="uk-modal-body">
								<p>Be careful if you delete this item there will be no way to go back. <strong>All monitors linked to this header will also lose this header</strong>.</p>
							</div>
							<div className="uk-modal-footer uk-text-right">
								<button className="uk-button uk-button-default uk-modal-close" >Cancel</button>
								<button className="uk-button uk-button-danger uk-modal-close" onClick={() => {this.handleDelete(id)}}>Yes</button>
							</div>
						</div>
					</div>
				</td>
			);
		}
		else {
			return(
				<td>
					<button type="button" className="uk-button icon-button" onClick={() => {this.handleDelete(id)}} uk-tooltip="title: Delete header"><i className="fas fa-trash-alt"></i></button>
				</td>
			);
		}
	}

  render() {
    return (
			<form id="headers-form" className="uk-form-horizontal">
				<fieldset>
					<legend>Headers</legend>
					<div>
						<table className="uk-table uk-table-divider uk-table-hover">
							<caption>Link existing headers to this monitor</caption>
							<thead>
								<tr>
									<th className="uk-table-shrink">Link</th>
									<th className="uk-table-expand">Content</th>
									<th className="actions-tab">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr className="loading">
									<td colSpan="3">Loading....</td>
								</tr>
								{Array.from(this.state.headers.values()).map((header, index) => {
									const superId = `${header.id}${index}`;
									return (
										<tr key={superId}>
											<td><input type="checkbox" id={`header-${superId}-check`} data-type={"check"} className="uk-checkbox" checked={header.check} onChange={(e) => {this.handleChange(e, header.id)}} /></td>
											<td>
												<div>
													<label className="uk-form-label" htmlFor={`${superId}-key`}>Name:</label>
													<div className="uk-form-controls">
														<input type="text" id={`header-${superId}-title`}  name={`${superId}-title`} data-type={"title"} className="uk-input" placeholder="Name of argument..." value={header.title} onChange={(e) => {this.handleChange(e, header.id)}}></input>
													</div>
													<label className="uk-form-label" htmlFor={`${superId}-value`}>Value:</label>
													<div className="uk-form-controls">
														<input type="text" id={`header-${superId}-value`} name={`${superId}-value`} data-type={"value"} className="uk-input" placeholder="Value..." value={header.value} onChange={(e) => {this.handleChange(e, header.id)}}></input>
													</div>
												</div>
											</td>
											{this.getActionOption(header.id > 0, superId, header.id)}
										</tr>
									);
								}) }
							</tbody>
						</table>	
					</div>
					<div className="add-header">
						<button className="uk-button icon-button" type="button" onClick={this.handleClickAdd}><i className="fas fa-plus-circle"></i></button>
					</div>
				</fieldset>
			</form>
			
		);
	}
}
