import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Meteor.users.groups', function (userId) {
	check(userId, String);

	return Meteor.users.find({ _id: userId }, { fields: { groups: 1 } });
});

Meteor.publish('Meteor.users.usernames', function () {
	return Meteor.users.find({}, { fields: { username: 1 } });
});
