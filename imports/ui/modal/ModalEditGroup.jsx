import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { group } from '/imports/db/schemas/group';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';
import { toast } from 'react-toastify';

const bridge = new SimpleSchema2Bridge(group);

/**
 * Form to create or edit the given `Group`.
 *
 * @param {{isOpen: Boolean, group: Object, closeModal: Function}} props
 * @param {Boolean} props.isOpen Know if the modal is open.
 * @param {Object} props.group The `Group` we are going to edit.
 * @param {Function} props.closeModal Callback to close the modal.
 */
class ModalEditGroup extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(newGroup) {
		if (this.props.group._id == null) {
			/** We are creating a new group */
			Meteor.call('groups.insert', newGroup, (err, res) => {
				if (err) {
					if (err.error === 'perms.groups.insert') {
						toast.error(err.reason);
					} else {
						toast.error('Something went wrong, try again later!');
					}
				} else {
					toast.success(newGroup.name + ' was successfully created!');
				}
			});

			this.props.closeModal();
		} else {
			/** We are editing an existing group */
			let oldGroup = this.props.group;

			if (oldGroup !== newGroup) {
				if (oldGroup._id === newGroup._id) {
					let updatedGroup = {};

					/** Only take attributes we want to update */
					for (let key of Object.keys(newGroup)) {
						if (oldGroup[key] !== newGroup[key]) {
							updatedGroup[key] = newGroup[key];
						}
					}

					Meteor.call(
						'groups.update',
						oldGroup._id,
						updatedGroup,
						(err, res) => {
							if (err) {
								if (err.error === 'perms.groups.update') {
									toast.error(err.reason);
								} else {
									toast.error('Something went wrong, try again later!');
								}
							} else {
								toast.success(newGroup.name + ' was successfully updated!');
							}
						}
					);

					this.props.closeModal();
				} else {
					/** The id of the new group differs from the old id */
					toast.error('Something went wrong, try again later!');
				}
			} else {
				/** No changes in the group */
				toast.error('Nothing to save!');
			}
		}
	}

	render() {
		let formRef;

		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>
					{this.props.group && this.props.group.name
						? 'Edit ' + this.props.group.name
						: 'Create a group'}
				</DialogTitle>

				<DialogContent>
					<AutoForm
						schema={bridge}
						model={this.props.group}
						ref={(ref) => (formRef = ref)}
						onSubmit={this.onSubmit}>
						<AutoFields omitFields={['multi']} />
						<ErrorsField />
					</AutoForm>
				</DialogContent>

				<DialogActions>
					<Button onClick={this.props.closeModal} variant='contained'>
						Cancel
					</Button>

					<Button
						onClick={() => formRef.submit()}
						variant='contained'
						color='primary'
						startIcon={<SaveIcon />}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default ModalEditGroup;
