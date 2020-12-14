import SimpleSchema from 'simpl-schema';
import { header } from '/imports/api/schemas/header'
import { version } from './version';

export const monitor = new SimpleSchema({
	name: String,
	url: String,
	selector: String,
	regex: String,
	icon_url: String,
	headers: [header],
	versions: [version],
});
