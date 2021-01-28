import SimpleSchema from 'simpl-schema';

export const monitorPerms = new SimpleSchema({
	monitor_id: String,
	canView: {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
	canCreate: {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
	canEdit: {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
	canDelete: {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
});
