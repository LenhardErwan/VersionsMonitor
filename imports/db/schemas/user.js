import SimpleSchema from 'simpl-schema';

export const user = new SimpleSchema({
	'username': String,
	'password': String,
});
