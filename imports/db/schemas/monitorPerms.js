import SimpleSchema from 'simpl-schema';

export const monitorPerms = new SimpleSchema({
	monitor_id: String,
	canView: {
		type: Boolean,
		defaultValue: false,
	},
	canEdit: {
		type: Boolean,
		defaultValue: false,
	},
	canDelete: {
		type: Boolean,
		defaultValue: false,
	},
});
