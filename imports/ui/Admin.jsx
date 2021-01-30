import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { navigate } from '@reach/router';
import { Grid } from '@material-ui/core';
import UserList from '/imports/ui/components/UserList';
import GroupList from '/imports/ui/components/GroupList';
import GroupsCollection from '/imports/db/GroupsCollection';

class Admin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid direction='row'>
				<UserList loading={this.props.usersLoading} users={this.props.users} />
				<GroupList
					loading={this.props.groupLoading}
					groups={this.props.groups}
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

	const usersHandle = Meteor.subscribe('Meteor.users.usernames');
	const usersLoading = !usersHandle.ready();

	const groupsHandle = Meteor.subscribe('group.list');
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
