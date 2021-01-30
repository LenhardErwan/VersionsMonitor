import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.publish('group.list', function () {
	return GroupsCollection.find();
});
