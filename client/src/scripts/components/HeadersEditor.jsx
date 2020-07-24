import React, { Component } from "react";

export default class HeadersEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headers_array: Array.from(this.props.headers.entries())
		};
		
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClickAdd = this.handleClickAdd.bind(this);
		this.handleClickDel = this.handleClickDel.bind(this);
	}
	
	handleSubmit() {
		if(this.state.headers_array.length > 0) {
			const nHeaders = new Map();
			for (const element of document.forms["headers-form"].querySelectorAll("input")) {
				this.state.headers_array[element.dataset.key][element.dataset.index] = element.value
			}
			for (const header of this.state.headers_array) {
				nHeaders.set(header[0], header[1]);
			}
			this.props.setHeaders(nHeaders);
		}
	}

	handleClickAdd() {
		this.state.headers_array.push(["",""])
		this.setState({
			headers_array: [...this.state.headers_array],
		})
	}

	handleClickDel(index) {
		this.state.headers_array.splice(index,1);
		this.setState({
			headers_array: [...this.state.headers_array],
		})
	}

	componentDidUpdate(prevProps) {
		if(prevProps != this.props) {
			this.setState({
				headers_array: Array.from(this.props.headers.entries())
			});
		}
	}

  render() {
    return (
			<form id="headers-form" className="uk-form-horizontal">
				<fieldset>
					<legend>Headers</legend>
					{this.state.headers_array.map((value, key) => {
						return(
							<div className="uk-margin" key={value[0]}>
								<div className="args-header">
									<h5>Argument {key+1}:</h5>
									<span className="delete-arg" uk-icon="icon: close" onClick={() => {this.handleClickDel(key)}}></span>
								</div>
								<div>
									<label className="uk-form-label" htmlFor={`${value[0]}-key`}>Name:</label>
									<div className="uk-form-controls">
										<input type="text" name={`${value[0]}-key`} data-key={key} data-index={0} className="uk-input" placeholder="Name of argument..." defaultValue={value[0]}></input>
									</div>
									<label className="uk-form-label" htmlFor={`${value[0]}-value`}>Value:</label>
									<div className="uk-form-controls">
										<input type="text" name={`${value[0]}-value`} data-key={key} data-index={1} className="uk-input" placeholder="Value..." defaultValue={value[1]}></input>
									</div>
								</div>
							</div>
						);
					})}
					<button className="uk-button icon-button" type="button" onClick={this.handleClickAdd}><i className="fas fa-plus-circle"></i></button>
				</fieldset>
			</form>
			
		);
	}
}
