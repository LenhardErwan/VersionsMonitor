import React, { Component } from 'react';
import { Img } from 'react-image';

export default class MonitorItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: this.props._id,
			name: this.props.name,
			url: this.props.url,
			selector: this.props.selector,
			regex: this.props.regex,
			icon_url: this.props.image,
			headers: this.props.headers,
			versions: this.props.versions,
		};
	}

	getVersionString() {
		let str;
		if (this.state.versions.length > 0) {
			str = this.state.versions[0].value;
		} else {
			str = 'No version';
		}
		return str;
	}

	getDateString() {
		let str;
		if (this.state.versions.length > 0) {
			str = new Date(
				this.state.versions[0].discovery_timestamp
			).toLocaleString();
		} else {
			str = 'No version';
		}
		return str;
	}

	render() {
		return (
			<tr key={this.state._id}>
				<td>
					<Img
						src={[
							this.state.image,
							`${new URL(this.state.url).origin}/favicon.ico`,
							'./images/no-image.svg',
						]}
					/>
				</td>
				<td>{this.state.name}</td>
				<td>{this.getVersionString()}</td>
				<td>{this.getDateString()}</td>
				<td>
					<a
						href={this.state.url}
						onClick={(event) => {
							event.preventDefault();
							const win = window.open(this.state.url, '_blank');
							win.focus();
						}}>
						Link
					</a>
				</td>
				<td>TODO</td>
			</tr>
		);
	}
}
