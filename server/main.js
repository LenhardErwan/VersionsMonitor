import { Meteor } from 'meteor/meteor';

import MonitorsCollection from '/imports/db/MonitorsCollection';
import GroupsCollection from '/imports/db/GroupsCollection';
import UsersCollection from '/imports/db/UsersCollection';

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

		let m3 = MonitorsCollection.insert({
			name: 'jeSuisNul',
			url: 'JeSuisUneURLNul',
			selector: 'JeSuisUnMauvaisSelector',
		});

		let g1 = GroupsCollection.insert({
			name: 'Viewer',
			canView: true,
			monitorsId: [m1, m2],
		});

		let g2 = GroupsCollection.insert({
			name: 'Editor',
			canView: true,
			canCreate: true,
			canEdit: true,
			canDelete: true,
			monitorsId: [m1, m2],
		});

		let u1 = UsersCollection.insert({
			login: 'John',
			password: 'helloworld',
			mail: 'john.smith@mail.net',
			groupsId: [g1],
		});

		let u2 = UsersCollection.insert({
			login: 'admin',
			password: 'securepassword',
			mail: 'admin@versions-monitor',
			groupsId: [g2],
		});
	}
});
