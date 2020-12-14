import SimpleSchema from 'simpl-schema';

export const group = new SimpleSchema({
	name: String,
	canView: Boolean,
	canCreate: Boolean,
	canEdit: Boolean,
	canDelete: Boolean,
	monitorsId: [String]
})