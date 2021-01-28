import { Mongo } from 'meteor/mongo';
import { group } from '/imports/db/schemas/group';

export default GroupsCollection = new Mongo.Collection('groups');

GroupsCollection.attachSchema(group);
