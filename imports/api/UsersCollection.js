import { Mongo } from 'meteor/mongo';
import { user } from '/imports/api/schemas/user';

export default UsersCollection = new Mongo.Collection('users');

UsersCollection.attachSchema(user);
