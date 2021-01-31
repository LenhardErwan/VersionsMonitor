import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.publish('groups.list', function () {
	return GroupsCollection.find();
});
