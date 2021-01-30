import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'user.isAdmin'() {
		const group_names = Meteor.users.findOne(
			{ _id: this.userId },
			{ fields: { _id: 0, groups: 1 } }
		);

		if (!group_names) {
			throw new Meteor.Error('user.connected', 'You are not connected');
		}

		const groups = GroupsCollection.find({
			name: { $in: group_names.groups },
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
	'user.canCreate.nomulti'() {
		const group = GroupsCollection.findOne({ name: this.userId });

		return group.canCreate;
	},
	'user.canCreate.multi'() {
		const group_names = Meteor.users.findOne(
			{ _id: this.userId },
			{ fields: { _id: 0, groups: 1 } }
		).groups;
		const groups = GroupsCollection.find({
			name: { $in: group_names },
		}).fetch();

		const validGroups = groups.filter((group) => {
			let isValid = false;
			if (group.multi) {
				isValid = group.canCreate;
			}
			return isValid;
		});

		return validGroups;
	},
});
