import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import MonitorsCollection from '/imports/db/MonitorsCollection';

Meteor.methods({
	'monitors.update'(monitorId, monitor) {
		check(monitorId, String);

		MonitorsCollection.update(monitorId, {
			$set: monitor,
		});
	},
});
