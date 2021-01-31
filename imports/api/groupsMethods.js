import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'groups.insert'(group) {
		//TODO create canCreateRole permisison ? Create if canManage permission ?
		if (Meteor.call('user.isAdmin', this.userId)) {
			GroupsCollection.insert(group);
		} else {
			throw new Meteor.Error(
				'perms.groups.insert',
				"You don't have permission to create a group!"
			);
		}
	},
	'groups.update'(groupId, groupParams) {
		const user_priority = Meteor.call(
			'user.groups.highestPriority',
			this.userId
		);
		const group = GroupsCollection.findOne({ _id: groupId });
		if (group) {
			if (
				user_priority < group.priority ||
				Meteor.call('user.isAdmin', this.userId)
			) {
				GroupsCollection.update(groupId, {
					$set: groupParams,
				});
			} else {
				throw new Meteor.Error(
					'perms.groups.insert',
					"You don't have permission to create a group!"
				);
			}
		} else {
			throw new Meteor.Error(
				'group.exist',
				`Group with id '${groupId} does not exist'!`
			);
		}
	},
	'groups.delete'(groupId) {
		const user_priority = Meteor.call(
			'user.groups.highestPriority',
			this.userId
		);
		const group = GroupsCollection.findOne({ _id: groupId });
		if (group) {
			if (
				user_priority < group.priority ||
				Meteor.call('user.isAdmin', this.userId)
			) {
				GroupsCollection.remove(groupId);
			} else {
				throw new Meteor.Error(
					'perms.groups.insert',
					"You don't have permission to create a group!"
				);
			}
		} else {
			throw new Meteor.Error(
				'group.exist',
				`Group with id '${groupId} does not exist'!`
			);
		}
	},
});
