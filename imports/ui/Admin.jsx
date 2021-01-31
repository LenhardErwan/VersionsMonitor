import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { navigate } from '@reach/router';
import {
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Popover,
	withStyles,
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import UserList from '/imports/ui/components/UserList';
import GroupList from '/imports/ui/components/GroupList';
import GroupsCollection from '/imports/db/GroupsCollection';
import FormModal from '/imports/ui/components/FormModal';

const styles = (theme) => ({
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: theme.spacing(1),
	},
});

class Admin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			menuAnchor: null,
			popoverAnchor: null,
			popoverText: '',
			is_fmodal_open: false,
			fmodal_name: null,
			fmodal_param: null,
		};

		this.openFormModal = this.openFormModal.bind(this);
		this.handleMenuOpen = this.handleMenuOpen.bind(this);
		this.handleMenuClose = this.handleMenuClose.bind(this);
		this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
		this.handlePopoverClose = this.handlePopoverClose.bind(this);
	}

	handleMenuOpen(event) {
		this.setState({
			menuAnchor: event.currentTarget,
		});
	}

	handleMenuClose() {
		this.setState({
			menuAnchor: null,
		});
	}

	handlePopoverOpen(event) {
		this.setState({
			popoverAnchor: event.currentTarget,
			popoverText: event.currentTarget.dataset.popover,
		});
	}

	handlePopoverClose() {
		this.setState({
			popoverAnchor: null,
		});
	}

	openFormModal(name, param) {
		this.setState({
			is_fmodal_open: true,
			fmodal_name: name,
			fmodal_param: param,
		});
	}

	render() {
		return (
			<Fragment>
				<Grid>
					<IconButton
						data-popover='Home'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}
						onClick={async () => await navigate('/')}>
						<HomeIcon />
					</IconButton>

					<IconButton
						data-popover='Create'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}
						onClick={this.handleMenuOpen}>
						<AddBoxIcon />
					</IconButton>

					<IconButton
						data-popover='Logout'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}
						onClick={() => Meteor.logout()}>
						<ExitToAppIcon />
					</IconButton>
				</Grid>

				<Grid container spacing={2}>
					<Grid item>
						<UserList
							loading={this.props.usersLoading}
							users={this.props.users}
							openFormModal={this.openFormModal}
							handlePopoverClose={this.handlePopoverClose}
							handlePopoverOpen={this.handlePopoverOpen}
						/>
					</Grid>

					<Grid item>
						<GroupList
							loading={this.props.groupsLoading}
							groups={this.props.groups}
							openFormModal={this.openFormModal}
							handlePopoverClose={this.handlePopoverClose}
							handlePopoverOpen={this.handlePopoverOpen}
						/>
					</Grid>

					<FormModal
						isOpen={this.state.is_fmodal_open}
						closeModal={() => this.setState({ is_fmodal_open: false })}
						name={this.state.fmodal_name}
						param={this.state.fmodal_param}
					/>
				</Grid>

				<Menu
					anchorEl={this.state.menuAnchor}
					keepMounted
					open={Boolean(this.state.menuAnchor)}
					onClose={this.handleMenuClose}>
					<MenuItem
						onClick={() => {
							this.handleMenuClose();
							this.openFormModal('edit_user', {});
						}}>
						User
					</MenuItem>

					<MenuItem
						onClick={() => {
							this.handleMenuClose();
							this.openFormModal('edit_group', {});
						}}>
						Group
					</MenuItem>
				</Menu>

				<Popover
					className={this.props.classes.popover}
					classes={{
						paper: this.props.classes.paper,
					}}
					open={Boolean(this.state.popoverAnchor)}
					anchorEl={this.state.popoverAnchor}
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
			</Fragment>
		);
	}
}

const AdminContainer = withTracker(() => {
	const user = Meteor.user();

	if (user === null) {
		navigate('/login');
	}

	const usersHandle = Meteor.subscribe('users.listUsername');
	const usersLoading = !usersHandle.ready();

	const groupsHandle = Meteor.subscribe('groups.list');
	const groupsLoading = !groupsHandle.ready();

	return {
		user: Meteor.user(),
		users: Meteor.users.find().fetch(),
		usersLoading: usersLoading,
		groups: GroupsCollection.find().fetch(),
		groupsLoading: groupsLoading,
	};
})(withStyles(styles)(Admin));

export default AdminContainer;
