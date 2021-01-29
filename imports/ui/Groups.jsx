import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class Groups extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div>Groups</div>;
	}
}

const GroupsContainer = withTracker(() => {
	return {
		user: Meteor.user(),
	};
})(Groups);

export default GroupsContainer;
