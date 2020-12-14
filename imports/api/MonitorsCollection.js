import { Mongo } from 'meteor/mongo';
import { monitor } from '/imports/api/schemas/monitor';

export default MonitorsCollection = new Mongo.Collection('people');

MonitorsCollection.attachSchema(monitor);
