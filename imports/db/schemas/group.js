import SimpleSchema from 'simpl-schema';

export const group = new SimpleSchema({
	name: String,
	canView: {
		type: Boolean,
		optional: true,
		defaultValue: false,
	},
	canCreate: {
		type: Boolean,
		optional: true,
		defaultValue: false,
	},
	canEdit: {
		type: Boolean,
		optional: true,
		defaultValue: false,
	},
	canDelete: {
		type: Boolean,
		optional: true,
		defaultValue: false,
	},
	monitorsId: [String],
});
