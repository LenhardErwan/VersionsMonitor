import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('Meteor.users.groups', function (userId) {
	check(userId, String);

	return Meteor.users.find({ _id: userId }, { fields: { groups: 1 } });
});
