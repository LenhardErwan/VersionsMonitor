import React from 'react';
import { Img } from 'react-image';
import {
	Avatar,
	CircularProgress,
	IconButton,
	Link,
	TableCell,
	TableRow,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.setState({
				id: this.props._id,
				name: this.props.name,
				url: this.props.url,
				selector: this.props.selector,
				regex: this.props.regex,
				icon_url: this.props.image,
				headers: this.props.headers,
				versions: this.props.versions,
				error: this.props.error ? this.props.error : null,
			});
		}

		return null;
	}

	render() {
		return (
			<TableRow
				key={this.state._id}
				{...(this.state.error === null ? {} : { negative: true })}>
				<TableCell component='th' scope='row'>
					<Avatar>
						<Img
							src={[
								this.state.icon_url,
								this.state.alternate_icon,
								'./images/no_image.svg',
							]}
							loader={<CircularProgress />}
						/>
					</Avatar>
				</TableCell>
				<TableCell>{this.state.name}</TableCell>
				<TableCell>{this.getVersionString()}</TableCell>
				<TableCell>{this.getDateString()}</TableCell>
				<TableCell>
					<Link href={this.state.url} target='_blank'>
						Link
					</Link>
				</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => this.props.onView(this.state)}>
						<VisibilityIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => this.props.handleEdit(this.state)}>
						<EditIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => this.props.handleDelete(this.state)}>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}
}
