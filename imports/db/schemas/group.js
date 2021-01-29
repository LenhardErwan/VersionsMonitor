import SimpleSchema from 'simpl-schema';

import { monitorPerms } from '/imports/db/schemas/monitorPerms';

export const group = new SimpleSchema({
	'name': String,
	'priority': Number,
	'administrator': {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
	'manageGroups': {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
	'canCreate': {
		type: Boolean,
		optional: false,
		defaultValue: false,
	},
	'monitorPerms': {
		type: Array,
		optional: false,
		defaultValue: [],
	},
	'monitorPerms.$': {
		type: monitorPerms,
	},
});
