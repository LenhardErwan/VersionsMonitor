import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'user.add.group'(username, group_names) {
		check(username, String);
		check(group_name, [String]);

		const user = Accounts.findUserByUsername(username);
		const errorGroups = new Array();
		if (user) {
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
					Meteor.users.update(
						{ _id: user._id },
						{ $pushAll: { groups: group_names } }
					);
					return true;
				}
			} else {
				throw new Meteor.Error('variable.array.empty', `Group array is empty!`);
			}
		} else {
			throw new Meteor.Error('user.exist', `User '${username}' does not exist`);
		}
	},
	'user.delete.group'(username, group_name) {
		check(username, String);
		check(group_name, [String]);

		const user = Accounts.findUserByUsername(username);
		const errorGroups = new Array();
		if (user) {
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
					Meteor.users.update(
						{ _id: user._id },
						{ $pullAll: { groups: group_names } }
					);
					return true;
				}
			} else {
				throw new Meteor.Error('variable.array.empty', `Group array is empty!`);
			}
		} else {
			throw new Meteor.Error('user.exist', `User '${username}' does not exist`);
		}
	},
	'user.isAdmin'() {
		const group_names = Meteor.users.findOne(
			{ _id: this.userId },
			{ fields: { _id: 0, groups: 1 } }
		);

		if (!group_names.groups) {
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
