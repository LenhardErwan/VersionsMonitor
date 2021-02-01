import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import GroupsCollection from '/imports/db/GroupsCollection';

function getGroups(userId) {
	const group_names = Meteor.users.findOne(
		{ _id: userId },
		{ fields: { _id: 0, groups: 1 } }
	);

	if (!group_names) {
		throw new Meteor.Error(
			'user.exist',
			`User with id '${userId}' does not exist!`
		);
	}

	return GroupsCollection.find({
		name: { $in: group_names.groups },
	}).fetch();
}

function isValidUserAndGroups(username, group_names) {
	const user = Accounts.findUserByUsername(username);
	if (user) {
		const errorGroups = new Array();
		if (group_names.length <= 0) {
			for (const name of group_names) {
				if (!GroupsCollection.findOne({ name: name })) errorGroups.push(name);
			}
			if (errorGroups.length > 0) {
				throw new Meteor.Error(
					'group.exist.list',
					`Following groups does not exist! [ ${errorGroups.join(', ')} ]`
				);
			} else {
				return true;
			}
		} else {
			throw new Meteor.Error('variable.array.empty', `Group array is empty!`);
		}
	} else {
		throw new Meteor.Error('user.exist', `User '${username}' does not exist`);
	}
}

Meteor.methods({
	'users.insert'(user) {
		//TODO define permission to create User
		Accounts.createUser(user);
		// Automaticaly create group only for this user (see server/main.js#Account.onCreateUser)
	},
	'users.update'(userId, user) {
		//TODO define permission to update User
		if (user.username) {
			Accounts.setUsername(userId, user.username);
		}

		if (user.password) {
			Accounts.setPassword(userId, user.password);
		}
	},
	'users.delete'(userId) {
		/* TODO define permission to delete User and make sure the current user
		 * can also delete the usergroup
		 */
		Meteor.users.remove(userId);
		Meteor.call('groups.delete.usergroup', userId);
	},
	'user.groups.add'(username, group_names) {
		check(username, String);
		check(group_name, [String]);

		if (isValidUserAndGroups(username, group_names)) {
			Meteor.users.update(
				{ _id: user._id },
				{ $pushAll: { groups: group_names } }
			);
			return true;
		}
	},
	'user.groups.remove'(username, group_name) {
		check(username, String);
		check(group_name, [String]);

		if (isValidUserAndGroups(username, group_names)) {
			Meteor.users.update(
				{ _id: user._id },
				{ $pullAll: { groups: group_names } }
			);
			return true;
		}
	},
	'user.isAdmin'(userId) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');

		const groups = getGroups(_userId);

		return groups.some((group) => {
			return group.administrator;
		});
	},
	'user.canManage'(userId, group) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const groups = getGroups(_userId);

		return groups.some((grp) => {
			return (
				(group.priority > 0 &&
					grp.priority > 0 &&
					grp.priority < group.priority &&
					grp.manageGroups) ||
				(group._id === grp._id && group.manageGroups)
			);
		});
	},
	'user.canCreate.nomulti'(userId) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const group = GroupsCollection.findOne({ name: _userId });

		return group.canCreate;
	},
	'user.canCreate.multi'(userId, group) {
		const _userId = userId ? userId : this.userId;
		if (!group.multi)
			throw new Meteor.Error(
				'group.nomulti',
				'This group is not a public group'
			);
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const groups = getGroups(_userId);

		return groups.some((grp) => {
			return (
				(group.priority > 0 &&
					grp.priority > 0 &&
					grp.priority < group.priority &&
					grp.multi &&
					grp.canCreate) ||
				(group._id === grp._id && group.canCreate)
			);
		});
	},
	'user.canEdit'(idMonitor, userId) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const groups = getGroups(_userId);

		return groups.some((group) => {
			return group.monitorPerms.some((perms) => {
				return perms.monitor_id === idMonitor && perms.canEdit;
			});
		});
	},
	'user.canDelete'(idMonitor, userId) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const groups = getGroups(_userId);

		return groups.some((group) => {
			return group.monitorPerms.some((perms) => {
				return perms.monitor_id === idMonitor && perms.canDelete;
			});
		});
	},
});
