import { Meteor } from 'meteor/meteor';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'groups.insert'(group) {
		//TODO Create specific permissions ?
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
		const group = GroupsCollection.findOne({ _id: groupId });
		if (group) {
			const canManage = Meteor.call('user.canManage', this.userId, group);
			if (canManage || Meteor.call('user.isAdmin', this.userId)) {
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
		const group = GroupsCollection.findOne({ _id: groupId });
		if (group) {
			const canManage = Meteor.call('user.canManage', this.userId, group);
			if (canManage || Meteor.call('user.isAdmin', this.userId)) {
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
