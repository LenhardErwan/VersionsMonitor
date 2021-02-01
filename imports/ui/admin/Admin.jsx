import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { navigate } from '@reach/router';
import {
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Typography,
	Divider,
	Popover,
	withStyles,
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import UserList from '/imports/ui/admin/AdminListUser';
import GroupList from '/imports/ui/admin/AdminListGroup';
import GroupsCollection from '/imports/db/GroupsCollection';

const styles = (theme) => ({
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: theme.spacing(1),
	},
});

/**
 * Admin page to manage users and groups.
 *
 * @param {{handleOpenModal: Function, user: Object, users: Array, usersLoading: Boolean, groups: Array, userGroups: Array, groupsLoading: Boolean}} props
 * @param {Function} props.handleOpenModal Callback to open a modal.
 * @param {Object} props.user The current user given by Meteor, can be:
 * - `null` If the user is not connected,
 * - `undefined` If Meteor is still fetching data,
 * - `Object` If the user is connected.
 * @param {Array} users List of users given by Meteor.
 * @param {Boolean} usersLoading Know if Meteor is still fetching users.
 * @param {Array} groups List of groups given by Meteor.
 * @param {Array} userGroups List of userGroups given by Meteor.
 * @param {Boolean} groupsLoading Know if Meteor is still fetching groups or userGroups.
 */
class Admin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			menuAnchor: null,
			popoverAnchor: null,
			popoverText: '',
		};

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
					<Grid item xs={4}>
						<Typography
							variant='h4'
							align='center'
							gutterBottom
							color='textSecondary'>
							Manage accounts
						</Typography>

						<UserList
							loading={this.props.usersLoading}
							users={this.props.users}
							openFormModal={this.props.handleOpenModal}
							handlePopoverClose={this.handlePopoverClose}
							handlePopoverOpen={this.handlePopoverOpen}
						/>
					</Grid>

					<Divider orientation='vertical' flexItem />

					<Grid item container justify='center' spacing={2} xs={8}>
						<Typography
							item
							variant='h4'
							gutterBottom
							align='center'
							color='textSecondary'>
							Manage permission
						</Typography>
						<Grid item container spacing={2} xs={12}>
							<Grid item justify='center' xs={6}>
								<Typography
									variant='h5'
									align='center'
									gutterBottom
									color='textSecondary'>
									Groups
								</Typography>

								<GroupList
									loading={this.props.groupsLoading}
									groups={this.props.groups}
									openFormModal={this.props.handleOpenModal}
									handlePopoverClose={this.handlePopoverClose}
									handlePopoverOpen={this.handlePopoverOpen}
								/>
							</Grid>

							<Grid justify='center' item xs={6}>
								<Typography
									variant='h5'
									align='center'
									gutterBottom
									color='textSecondary'>
									Users
								</Typography>

								<GroupList
									loading={this.props.groupsLoading}
									groups={this.props.userGroups}
									openFormModal={this.props.handleOpenModal}
									handlePopoverClose={this.handlePopoverClose}
									handlePopoverOpen={this.handlePopoverOpen}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				<Menu
					anchorEl={this.state.menuAnchor}
					keepMounted
					open={Boolean(this.state.menuAnchor)}
					onClose={this.handleMenuClose}>
					<MenuItem
						onClick={() => {
							this.handleMenuClose();
							this.props.handleOpenModal('edit_user', {});
						}}>
						User
					</MenuItem>

					<MenuItem
						onClick={() => {
							this.handleMenuClose();
							this.props.handleOpenModal('edit_group', {});
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
		/** If the user is not connected redirect to '/login' */
		navigate('/login');
	}

	const usersHandle = Meteor.subscribe('users.listUsername');
	const usersLoading = !usersHandle.ready();

	const groupsHandle = Meteor.subscribe('groups.list');
	const groupsLoading = !groupsHandle.ready();

	const userGroupsHandle = Meteor.subscribe('groups.user.list');
	const userGroupsLoading = !userGroupsHandle.ready();

	const groups = GroupsCollection.find().fetch();

	const userGroups = groups.filter((group) => {
		return !group.multi;
	});

	for (let userGroup of userGroups) {
		const userFound = Meteor.users.findOne(userGroup.name, { username: 1 });
		if (userFound) {
			userGroup.name = userFound.username;
		} else {
			console.error(`User with id ${userGroup.name} not found`);
		}
	}

	return {
		user: Meteor.user(),
		users: Meteor.users.find().fetch(),
		usersLoading: usersLoading,
		groups: groups.filter((group) => {
			return group.multi;
		}),
		userGroups: userGroups,
		groupsLoading: groupsLoading && userGroupsLoading,
	};
})(withStyles(styles)(Admin));

export default AdminContainer;
