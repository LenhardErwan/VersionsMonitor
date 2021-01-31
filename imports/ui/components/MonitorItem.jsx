import React from 'react';
import { Img } from 'react-image';
import {
	Avatar,
	CircularProgress,
	IconButton,
	Link,
	TableCell,
	TableRow,
	Popover,
	withStyles,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = (theme) => ({
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: theme.spacing(1),
	},
});

class MonitorItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			anchorEl: null,
			popoverText: '',
		};

		if (this.props.error)
			console.error(this.props.name, ': ', this.props.error);

		try {
			this.state.alternate_icon = `${
				new URL(this.props.url).origin
			}/favicon.ico`;
		} catch (err) {
			console.error(err);
		}

		this.handlePopoverClose = this.handlePopoverClose.bind(this);
		this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
	}

	getVersionString() {
		let str;
		if (this.props.versions.length > 0) {
			str = this.props.versions[0].label;
		} else {
			str = 'No version';
		}
		return str;
	}

	getDateString() {
		let str;
		if (this.props.versions.length > 0) {
			str = new Date(this.props.versions[0].date).toLocaleString();
		} else {
			str = 'No version';
		}
		return str;
	}

	handlePopoverOpen = (event) => {
		this.setState({
			anchorEl: event.currentTarget,
			popoverText: event.currentTarget.dataset.popover,
		});
	};

	handlePopoverClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const open = Boolean(this.state.anchorEl);

		return (
			<TableRow
				key={this.props._id}
				className={this.props.error ? 'negative' : ''}>
				<TableCell component='th' scope='row'>
					<Avatar>
						<Img
							src={[
								this.props.icon_url,
								this.state.alternate_icon,
								'./images/no_image.svg',
							]}
							loader={<CircularProgress />}
						/>
					</Avatar>
				</TableCell>
				<TableCell>{this.props.name}</TableCell>
				<TableCell>{this.getVersionString()}</TableCell>
				<TableCell>{this.getDateString()}</TableCell>
				<TableCell>
					<Link href={this.props.url} target='_blank'>
						Link
					</Link>
				</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => this.props.onView(this.props)}
						data-popover='View'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}>
						<VisibilityIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => this.props.handleEdit(this.props)}
						data-popover='Edit'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}>
						<EditIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => this.props.handleDelete(this.props)}
						data-popover='Delete'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}>
						<DeleteIcon />
					</IconButton>
					<Popover
						className={this.props.classes.popover}
						classes={{
							paper: this.props.classes.paper,
						}}
						open={open}
						anchorEl={this.state.anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						onClose={this.handlePopoverClose}
						disableRestoreFocus>
						{this.state.popoverText}
					</Popover>
				</TableCell>
			</TableRow>
		);
	}
}

export default withStyles(useStyles)(MonitorItem);
