import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'user.isAdmin'() {
		const group_names = Meteor.users.findOne(
			{ _id: this.userId },
			{ fields: { _id: 0, groups: 1 } }
		).groups;
		const groups = GroupsCollection.find({
			name: { $in: group_names },
		}).fetch();

		return groups.some((group) => {
			group.administrator;
		});
	},
	'user.canManage'() {
		const group_names = Meteor.users.findOne(
			{ _id: this.userId },
			{ fields: { _id: 0, groups: 1 } }
		).groups;
		const groups = GroupsCollection.find({
			name: { $in: group_names },
		}).fetch();

		return groups.some((group) => {
			group.manageGroups;
		});
	},
});
