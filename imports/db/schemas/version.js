import SimpleSchema from 'simpl-schema';

export const version = new SimpleSchema({
	label: String,
	date: Date,
});
