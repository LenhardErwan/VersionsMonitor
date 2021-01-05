import SimpleSchema from 'simpl-schema';

export const user = new SimpleSchema({
	login: String,
	password: String,
	mail: SimpleSchema.RegEx.Email,
	groupsId: [String],
});
