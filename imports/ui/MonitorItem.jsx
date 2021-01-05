import React, { Component } from 'react';
import { Button, Image, Table } from 'semantic-ui-react';

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
			<Table.Row key={this.state._id}>
				<Table.Cell image>
					<Image
						src={
							this.state.image
								? this.state.image
								: `${new URL(this.state.url).origin}/favicon.ico`
								? `${new URL(this.state.url).origin}/favicon.ico`
								: 'images/no_image.svg'
						}
						size='mini'
					/>
				</Table.Cell>
				<Table.Cell>{this.state.name}</Table.Cell>
				<Table.Cell>{this.getVersionString()}</Table.Cell>
				<Table.Cell>{this.getDateString()}</Table.Cell>
				<Table.Cell>
					<a href={this.state.url} target='_blank'>
						Link
					</a>
				</Table.Cell>
				<Table.Cell>
					<Button
						circular
						icon='edit'
						onClick={() => this.props.onEdit(this.state)}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}
