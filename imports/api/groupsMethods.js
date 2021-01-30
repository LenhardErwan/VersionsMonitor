import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'group.insert'(group) {
		GroupsCollection.insert(group);
	},
	'group.update'(groupId, group) {
		GroupsCollection.update(groupId, {
			$set: group,
		});
	},
	'group.delete'(groupId) {
		MonitorsCollection.remove(groupId);
	},
});
