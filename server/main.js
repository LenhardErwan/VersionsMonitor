import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

import '/imports/api/monitorsPublications';
import '/imports/api/monitorsMethods';
import '/imports/api/usersPublications';
import '/imports/api/usersMethods';
import '/imports/api/groupsPublications';
import '/imports/api/groupsMethods';
import App from '/server/app.js';

Meteor.startup(() => {
	const app = new App();

	const cursor = MonitorsCollection.find();
	cursor.observe({
		added: function (monitor) {
			app.check(monitor);
		},
		changed: function (monitor) {
			app.check(monitor);
		},
	});

	Accounts.onCreateUser((options, user) => {
		user._id = Random.id();

		GroupsCollection.insert({
			name: user._id,
			priority: 0,
			multi: false,
			canCreate: true,
		});
		user.groups = [user._id, 'everyone'];

		if (options.profile) {
			user.profile = options.profile;
		}

		return user;
	});

	if (!Accounts.findUserByUsername('meteorite')) {
		Accounts.createUser({
			username: 'meteorite',
			password: 'password',
		});
	}

	if (GroupsCollection.find({ name: 'everyone' }).count() <= 0) {
		GroupsCollection.insert({
			name: 'everyone',
			priority: -1,
		});
	}

	if (MonitorsCollection.find().count() <= 0) {
		let m1 = MonitorsCollection.insert({
			name: 'VersionsMonitor',
			url: 'https://github.com/LenhardErwan/VersionsMonitor/releases',
			selector: '.release-entry .release-header a',
		});

		let m2 = MonitorsCollection.insert({
			name: 'BeerBrowser',
			url: 'https://github.com/LenhardErwan/BeerBrowser/releases',
			selector: '.release-entry .release-main-section a',
		});

		GroupsCollection.update(
			{ name: 'everyone' },
			{ $push: { monitorPerms: { monitor_id: m1, canView: true } } }
		);

		GroupsCollection.update(
			{ name: 'everyone' },
			{ $push: { monitorPerms: { monitor_id: m2, canView: true } } }
		);
	}
});
