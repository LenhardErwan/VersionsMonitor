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
	'user.insert'(user) {
		//TODO define permission to create User
		Accounts.createUser(user);
		// Automaticaly create group only for this user (see server/main.js#Account.onCreateUser)
	},
	'user.update'(userId, user) {
		//TODO define permission to update User
		Meteor.users.update(userId, {
			$set: user,
		});
	},
	'user.delete'(userId) {
		//TODO define permission to delete User
		Meteor.users.remove(userId);
		Meteor.call('group.delete', userId);
	},
	'user.group.add'(username, group_names) {
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
	'user.group.delete'(username, group_name) {
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
	/**
	 * Get the priority of the higher group of the user
	 * @param {string} userId id of the user
	 * @returns {number | null} priority of higher or null if user doesn't have public group assigned
	 */
	'user.group.higher.priority'(userId) {
		const groups = getGroups(userId);

		// Reduce array to have the lowest priority (highest group) (Ex: admin group should be at 1)
		return groups.reduce((a, b) => {
			const _a = a.priority,
				_b = b.priority;
			if (_a > 0 && _b > 0) return _a > _b ? b : a;
			else if (_a > 0 && (_b <= 0 || _b === null)) return a;
			else if (_b > 0 && (_a <= 0 || _a === null)) return b;
			else return { priority: null };
		});
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
	'user.canManage'(userId) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const groups = getGroups(_userId);

		return groups.some((group) => {
			return group.manageGroups;
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
	'user.canCreate.multi'(userId) {
		const _userId = userId ? userId : this.userId;
		if (!_userId)
			throw new Meteor.Error('user.connected', 'You are not connected');
		if (Meteor.call('user.isAdmin', _userId)) return true;

		const groups = getGroups(_userId);

		return groups.filter((group) => {
			let isValid = false;
			if (group.multi) {
				isValid = group.canCreate;
			}
			return isValid;
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
