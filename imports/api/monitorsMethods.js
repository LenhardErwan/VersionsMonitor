import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'monitors.insert'(monitor) {
		const id = MonitorsCollection.insert(monitor);
		GroupsCollection.update(
			{ name: 'everyone' },
			{ $push: { monitorPerms: { monitor_id: id, canView: true } } }
		);
	},
	'monitors.update'(monitorId, monitor) {
		check(monitorId, String);

		MonitorsCollection.update(monitorId, {
			$set: monitor,
		});
	},
	'monitors.delete'(monitorId) {
		MonitorsCollection.remove(monitorId);
		GroupsCollection.update(
			{},
			{ $pull: { monitorPerms: { monitor_id: monitorId } } },
			{ multi: true }
		);
	},
});
