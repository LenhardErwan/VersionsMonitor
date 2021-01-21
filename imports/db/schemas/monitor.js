import SimpleSchema from 'simpl-schema';
import { header } from '/imports/db/schemas/header';
import { version } from '/imports/db/schemas/version';

export const monitor = new SimpleSchema({
	'name': String,
	'url': String,
	'selector': String,
	'regex': {
		type: String,
		optional: true,
		defaultValue: null,
	},
	'icon_url': {
		type: String,
		optional: true,
		defaultValue: null,
	},
	'headers': {
		type: Array,
		optional: true,
		defaultValue: [],
	},
	'headers.$': {
		type: header,
	},
	'versions': {
		type: Array,
		optional: true,
		defaultValue: [],
	},
	'versions.$': {
		type: version,
	},
	'error': {
		type: String,
		optional: true,
		defaultValue: null,
	},
});
