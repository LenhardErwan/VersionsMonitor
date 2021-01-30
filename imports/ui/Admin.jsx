import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class Admin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return null;
	}
}

const AdminContainer = withTracker(() => {
	return {
		user: Meteor.user(),
	};
})(Admin);

export default AdminContainer;
