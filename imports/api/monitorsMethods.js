import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import MonitorsCollection from '/imports/db/MonitorsCollection';

Meteor.methods({
	'monitors.update'(monitorId, monitor) {
		check(monitorId, String);

		// Could not find how to validate only specific keys
		// I must send the whole object even if only the name is updated
		delete monitor.id;
		MonitorsCollection.update(monitorId, {
			$set: monitor,
		});
	},
});
