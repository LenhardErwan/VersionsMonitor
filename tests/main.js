import assert from 'assert';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';
import UsersCollection from '/imports/db/UsersCollection';

describe('VersionsMonitor', function () {
	it('package.json has correct name', async function () {
		const { name } = await import('../package.json');
		assert.strictEqual(name, 'VersionsMonitor');
	});

	if (Meteor.isClient) {
		it('client is not server', function () {
			assert.strictEqual(Meteor.isServer, false);
		});
	}

	if (Meteor.isServer) {
		it('server is not client', function () {
			assert.strictEqual(Meteor.isClient, false);
		});
	}

	describe('Database Insertion', function () {
		it('monitor inserted with optional values', function () {
			let monitor = {
				name: 'monitor-01',
				url: 'http://monitor-01',
				selector: 'body div p',
				regex: '(d+.)?(d+.)?(*|d+)',
				icon_url: 'http://monitor-01/icon.svg',
				headers: [
					{
						name: 'browser',
						value: 'firefox',
					},
				],
				versions: [
					{
						label: 'v1.0',
						date: new Date(),
					},
				],
			};

			monitor._id = MonitorsCollection.insert(monitor);
			monitorDb = MonitorsCollection.findOne(monitor._id);

			assert.deepEqual(monitor, monitorDb);
		});

		it('monitor inserted without optional values', function () {
			let monitor = {
				name: 'monitor-01',
				url: 'http://monitor-01',
				selector: 'body div p',
			};

			monitor._id = MonitorsCollection.insert(monitor);
			monitorDb = MonitorsCollection.findOne(monitor._id);

			monitor.regex = null;
			monitor.icon_url = null;
			monitor.headers = [];
			monitor.versions = [];

			assert.deepEqual(monitor, monitorDb);
		});

		it('group inserted with optional values', function () {
			let group = {
				name: 'group-01',
				canView: true,
				canCreate: true,
				canEdit: true,
				canDelete: true,
				monitorsId: ['monitor-01'],
			};

			group._id = GroupsCollection.insert(group);
			groupDb = GroupsCollection.findOne(group._id);

			assert.deepEqual(group, groupDb);
		});

		it('group inserted without optional values', function () {
			let group = {
				name: 'group-01',
				monitorsId: ['monitor-01'],
			};

			group._id = GroupsCollection.insert(group);
			groupDb = GroupsCollection.findOne(group._id);

			group.canView = false;
			group.canCreate = false;
			group.canEdit = false;
			group.canDelete = false;

			assert.deepEqual(group, groupDb);
		});

		it('user inserted', function () {
			let user = {
				login: 'admin',
				password: 'securepassword',
				mail: 'admin@admin',
				groupsId: ['group-01'],
			};

			user._id = UsersCollection.insert(user);
			userDb = UsersCollection.findOne(user._id);

			assert.deepEqual(user, userDb);
		});
	});
});
