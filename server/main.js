import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import MonitorsCollection from '/imports/db/MonitorsCollection';

import '/imports/api/monitorsPublications';
import '/imports/api/monitorsMethods';
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

	if (!Accounts.findUserByUsername('meteorite')) {
		Accounts.createUser({
		  	username: 'meteorite',
		  	password: 'password',
		});
	}

	if (MonitorsCollection.find().count() == 0) {
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
	}
});
