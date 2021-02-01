import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'groups.insert'(group) {
		//TODO add permissions if user canCreate in it (higher priority)
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
					'perms.groups.update',
					"You don't have permission to update this group!"
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
					'perms.groups.delete',
					"You don't have permission to delete this group!"
				);
			}
		} else {
			throw new Meteor.Error(
				'group.exist',
				`Group with id '${groupId} does not exist'!`
			);
		}
	},
	'groups.delete.usergroup'(userId) {
		const group = GroupsCollection.findOne({ name: userId });
		if (group) {
			if (Meteor.call('user.isAdmin', this.userId)) {
				GroupsCollection.remove(group._id);
			} else {
				throw new Meteor.Error(
					'perms.groups.delete',
					"You don't have permission to delete this group!"
				);
			}
		} else {
			throw new Meteor.Error(
				'group.exist',
				`Group with name '${userId} does not exist'!`
			);
		}
	},
});
