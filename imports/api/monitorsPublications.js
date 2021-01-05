import { Meteor } from 'meteor/meteor';
import MonitorsCollection from '/imports/db/MonitorsCollection';

Meteor.publish('monitors.list', function () {
	return MonitorsCollection.find();
});
