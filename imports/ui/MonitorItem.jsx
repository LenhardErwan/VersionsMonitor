import React, { Component } from 'react';
import { Img } from 'react-image';
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
			str = this.state.versions[0].label;
		} else {
			str = 'No version';
		}
		return str;
	}

	getDateString() {
		let str;
		if (this.state.versions.length > 0) {
			str = new Date(this.state.versions[0].date).toLocaleString();
		} else {
			str = 'No version';
		}
		return str;
	}

	render() {
		return (
			<Table.Row key={this.state._id}>
				<Table.Cell>
					<Image>
						<Img
							src={[
								this.state.icon_url,
								`${new URL(this.state.url).origin}/favicon.ico`,
								'./images/no-image.svg',
							]}
						/>
					</Image>
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
