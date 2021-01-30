import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'monitors.insert'(monitor) {
		const group = GroupsCollection.findOne({ name: this.userId });
		if (group.canCreate) {
			const id = MonitorsCollection.insert(monitor);
			GroupsCollection.update(
				{ name: this.userId },
				{ $push: { monitorPerms: { monitor_id: id, canView: true } } }
			);
		} else {
			throw new Meteor.Error(
				'create.perms',
				"You don't have permission to create a monitor!"
			);
		}
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
