import { Mongo } from 'meteor/mongo';
import { group } from '/imports/api/schemas/group';

export default GroupsCollection = new Mongo.Collection('groups');

GroupsCollection.attachSchema(group);
