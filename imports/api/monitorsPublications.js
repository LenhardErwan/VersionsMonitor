import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.publish('monitors.list', function (group_names) {
	check(group_names, [String]);

	const groups = GroupsCollection.find(
		{ name: { $in: group_names } },
		{ '_id': 0, 'monitorPerms.monitor_id': 1 }
	);
	const monitorIds = new Array();
	for (const group of groups) {
		for (const perm of group.monitorPerms) {
			monitorIds.push(perm.monitor_id);
		}
	}

	return MonitorsCollection.find({ _id: { $in: monitorIds } });
});
