import SimpleSchema from 'simpl-schema';

import { monitorPerms } from '/imports/db/schemas/monitorPerms';

export const group = new SimpleSchema({
	'name': String,
	'perms': {
		type: Array,
		defaultValue: [],
	},
	'perms.$': {
		type: monitorPerms,
	},
});
