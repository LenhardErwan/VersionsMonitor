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
import ModalContainer from '/imports/ui/modal/ModalContainer';

const styles = (theme) => ({
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: theme.spacing(1),
	},
});

class HomeItemMonitor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			anchorEl: null,
			popoverText: '',
		};

		if (this.props.monitor.error)
			console.error(this.props.monitor.name, ': ', this.props.monitor.error);

		try {
			this.state.alternate_icon = `${
				new URL(this.props.monitor.url).origin
			}/favicon.ico`;
		} catch (err) {
			console.error(err);
		}

		this.handlePopoverClose = this.handlePopoverClose.bind(this);
		this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
	}

	getVersionString() {
		let str;
		if (this.props.monitor.versions.length > 0) {
			str = this.props.monitor.versions[0].label;
		} else {
			str = 'No version';
		}
		return str;
	}

	getDateString() {
		let str;
		if (this.props.monitor.versions.length > 0) {
			str = new Date(this.props.monitor.versions[0].date).toLocaleString();
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
				key={this.props.monitor._id}
				className={this.props.monitor.error ? 'negative' : ''}>
				<TableCell component='th' scope='row'>
					<Avatar>
						<Img
							src={[
								this.props.monitor.icon_url,
								this.state.alternate_icon,
								'./images/no_image.svg',
							]}
							loader={<CircularProgress />}
						/>
					</Avatar>
				</TableCell>
				<TableCell>{this.props.monitor.name}</TableCell>
				<TableCell>{this.getVersionString()}</TableCell>
				<TableCell>{this.getDateString()}</TableCell>
				<TableCell>
					<Link href={this.props.monitor.url} target='_blank'>
						Link
					</Link>
				</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() =>
							ModalContainer.openModal('view_monitor', this.props.monitor)
						}
						data-popover='View'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}>
						<VisibilityIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() =>
							ModalContainer.openModal('edit_monitor', this.props.monitor)
						}
						data-popover='Edit'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}>
						<EditIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() =>
							ModalContainer.openModal('delete_monitor', this.props.monitor)
						}
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

export default withStyles(styles)(HomeItemMonitor);
