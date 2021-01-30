import SimpleSchema from 'simpl-schema';

import { monitorPerms } from '/imports/db/schemas/monitorPerms';

export const group = new SimpleSchema({
	'name': String,
	'priority': Number,
	'multi': {
		type: Boolean,
		defaultValue: true,
	},
	'administrator': {
		type: Boolean,
		defaultValue: false,
	},
	'manageGroups': {
		type: Boolean,
		defaultValue: false,
	},
	'canCreate': {
		type: Boolean,
		defaultValue: false,
	},
	'monitorPerms': {
		type: Array,
		defaultValue: [],
	},
	'monitorPerms.$': {
		type: monitorPerms,
	},
});
