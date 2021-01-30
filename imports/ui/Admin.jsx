import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { navigate } from '@reach/router';

class Admin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return null;
	}
}

const AdminContainer = withTracker(() => {
	const user = Meteor.user();

	if (user === null) {
		navigate('/login');
	}

	return {
		user: Meteor.user(),
	};
})(Admin);

export default AdminContainer;
