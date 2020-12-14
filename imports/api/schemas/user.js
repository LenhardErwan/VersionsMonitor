import SimpleSchema from 'simpl-schema';

export const user = new SimpleSchema({
	login: String,
	password: String,
	mail: String,
	groupsId: [String]
})