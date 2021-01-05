import { Mongo } from 'meteor/mongo';
import { monitor } from '/imports/db/schemas/monitor';

export default MonitorsCollection = new Mongo.Collection('monitors');

MonitorsCollection.attachSchema(monitor);
