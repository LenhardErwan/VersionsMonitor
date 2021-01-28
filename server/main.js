import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';

import '/imports/api/monitorsPublications';
import '/imports/api/monitorsMethods';
import '/imports/api/usersPublications';
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
		user.groups = ['everyone'];

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

	let g_everyone = null;
	if (GroupsCollection.find().count() <= 0) {
		g_everyone = GroupsCollection.insert({
			name: 'everyone',
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

		let g_test = GroupsCollection.insert({
			name: 'test',
		});

		GroupsCollection.update(
			{ _id: g_everyone },
			{ $push: { perms: { monitor_id: m1, canView: true } } }
		);

		GroupsCollection.update(
			{ _id: g_test },
			{ $push: { perms: { monitor_id: m2, canView: true } } }
		);
	}
});
