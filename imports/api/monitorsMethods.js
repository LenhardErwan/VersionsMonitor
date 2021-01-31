import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Promise } from 'meteor/promise';

import { getNewestVersion } from '/server/app.js';
import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

Meteor.methods({
	'monitors.insert'(monitor) {
		if (Meteor.call('user.canCreate.nomulti')) {
			const id = MonitorsCollection.insert(monitor);
			GroupsCollection.update(
				{ name: this.userId },
				{
					$push: {
						monitorPerms: {
							monitor_id: id,
							canView: true,
							canEdit: true,
							canDelete: true,
						},
					},
				}
			);
			return true;
		} else {
			throw new Meteor.Error(
				'perms.monitors.insert',
				"You don't have permission to create a monitor!"
			);
		}
	},
	'monitors.update'(monitorId, monitor) {
		check(monitorId, String);

		if (Meteor.call('user.canEdit', monitorId)) {
			MonitorsCollection.update(monitorId, {
				$set: monitor,
			});
		} else {
			throw new Meteor.Error(
				'perms.monitors.update',
				"You don't have permission to update this monitor!"
			);
		}
	},
	'monitors.delete'(monitorId) {
		check(monitorId, String);

		if (Meteor.call('user.canDelete', monitorId)) {
			MonitorsCollection.remove(monitorId);
			GroupsCollection.update(
				{},
				{ $pull: { monitorPerms: { monitor_id: monitorId } } },
				{ multi: true }
			);
		} else {
			throw new Meteor.Error(
				'perms.monitors.delete',
				"You don't have permission to delete this monitor!"
			);
		}
	},
	'monitors.preview'(monitor) {
		try {
			return Promise.await(getNewestVersion(monitor));
		} catch (err) {
			if (err instanceof TypeError) {
				throw new Meteor.Error('monitors.preview', err.message);
			} else {
				throw new Meteor.Error('monitors.preview.error', err);
			}
		}
	},
});
