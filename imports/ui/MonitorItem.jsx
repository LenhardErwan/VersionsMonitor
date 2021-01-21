import React from 'react';
import { Img } from 'react-image';
import { Button, Loader, Image, Table } from 'semantic-ui-react';

export default class MonitorItem extends React.Component {
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
			error: this.props.error ? this.props.error : null,
		};

		if (this.state.error !== null)
			console.error(this.state.name, ': ', this.state.error);

		try {
			this.state.alternate_icon = `${
				new URL(this.state.url).origin
			}/favicon.ico`;
		} catch (err) {
			console.error(err);
		}
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
			<Table.Row
				key={this.state._id}
				{...(this.state.error === null ? {} : { negative: true })}>
				<Table.Cell collapsing>
					<Image className='icon-list'>
						<Img
							src={[
								this.state.icon_url,
								this.state.alternate_icon,
								'./images/no_image.svg',
							]}
							loader={<Loader active inline='centered' />}
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
						className='action-button'
						icon='eye'
						onClick={() => this.props.onView(this.state)}
					/>
					<Button
						className='action-button'
						icon='edit'
						onClick={() => this.props.onEdit(this.state)}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}
