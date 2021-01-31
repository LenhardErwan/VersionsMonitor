import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { navigate } from '@reach/router';
import { Grid, IconButton } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import UserList from '/imports/ui/components/UserList';
import GroupList from '/imports/ui/components/GroupList';
import GroupsCollection from '/imports/db/GroupsCollection';
import FormModal from '/imports/ui/components/FormModal';

class Admin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			is_fmodal_open: false,
			fmodal_name: null,
			fmodal_param: null,
		};

		this.openFormModal = this.openFormModal.bind(this);
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
			<Grid container spacing={2}>
				<Grid item>
					<IconButton onClick={() => this.openFormModal('edit_user', {})}>
						<AddBoxIcon />
					</IconButton>

					<UserList
						loading={this.props.usersLoading}
						users={this.props.users}
						openFormModal={this.openFormModal}
					/>
				</Grid>

				<Grid item>
					<IconButton onClick={() => this.openFormModal('edit_group', {})}>
						<AddBoxIcon />
					</IconButton>

					<GroupList
						loading={this.props.groupsLoading}
						groups={this.props.groups}
						openFormModal={this.openFormModal}
					/>
				</Grid>

				<FormModal
					isOpen={this.state.is_fmodal_open}
					closeModal={() => this.setState({ is_fmodal_open: false })}
					name={this.state.fmodal_name}
					param={this.state.fmodal_param}
				/>
			</Grid>
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
})(Admin);

export default AdminContainer;
