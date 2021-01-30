import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.publish('monitors.list', function (group_names) {
	check(group_names, [String]);

	const userMonitors = new Map();

	const groups = GroupsCollection.find({ name: { $in: group_names } });

	for (const group of groups) {
		if (group.monitorPerms) {
			for (const perm of group.monitorPerms) {
				if (perm.canView) {
					const monitor = MonitorsCollection.findOne({ _id: perm.monitor_id });
					if (monitor) {
						this.added('monitors', monitor._id, monitor);
						userMonitors.set(monitor._id, monitor);
					}
				}
			}
		}
	}

	const handleMonitor = MonitorsCollection.find().observeChanges({
		changed: (id, monitor) => {
			if (userMonitors.has(id)) {
				this.changed('monitors', id, monitor);
			}
		},
	});

	const handleGroups = groups.observe({
		changed: (newGroup, oldGroup) => {
			if (newGroup.monitorPerms && oldGroup.monitorPerms) {
				// Get differences
				const added = newGroup.monitorPerms.filter(
					(x) =>
						!oldGroup.monitorPerms.some((y) => y.monitor_id === x.monitor_id)
				);
				const removed = oldGroup.monitorPerms.filter(
					(x) =>
						!newGroup.monitorPerms.some((y) => y.monitor_id === x.monitor_id)
				);
				const newPerms = newGroup.monitorPerms.filter((x) =>
					oldGroup.monitorPerms.some(
						(y) => y.monitor_id === x.monitor_id && y.canView !== x.canView
					)
				);

				if (added.length > 0) {
					for (const perms of added) {
						if (perms.canView) {
							const monitor = MonitorsCollection.findOne({
								_id: perms.monitor_id,
							});
							if (monitor) {
								this.added('monitors', monitor._id, monitor);
								userMonitors.set(monitor._id, monitor);
							}
						}
					}
				}
				if (removed.length > 0) {
					for (const perms of removed) {
						this.removed('monitors', perms.monitor_id);
						userMonitors.delete(perms.monitor_id);
					}
				}
				if (newPerms.length > 0) {
					for (const perms of newPerms) {
						if (perms.canView) {
							const monitor = MonitorsCollection.findOne({
								_id: perms.monitor_id,
							});
							if (monitor) {
								this.added('monitors', monitor._id, monitor);
								userMonitors.set(monitor._id, monitor);
							}
						} else {
							this.removed('monitors', perms.monitor_id);
							userMonitors.delete(perms.monitor_id);
						}
					}
				}
			}
		},
	});

	this.ready();
	this.onStop(() => {
		handleGroups.stop();
		handleMonitor.stop();
	});
});
