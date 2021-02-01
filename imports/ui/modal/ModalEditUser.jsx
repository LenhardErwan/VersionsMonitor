import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { user } from '/imports/db/schemas/user';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';
import { toast } from 'react-toastify';

const bridge = new SimpleSchema2Bridge(user);

/**
 * Form to create or edit the given `User`.
 *
 * @param {{isOpen: Boolean, user: Object, closeModal: Function}} props
 * @param {Boolean} props.isOpen Know if the modal is open.
 * @param {Object} props.user The `User` we are going to edit.
 * @param {Function} props.closeModal Callback to close the modal.
 */
class ModalEditUser extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(newUser) {
		if (this.props.user._id == null) {
			/** We are creating a new user */
			Meteor.call('users.insert', newUser, (err, res) => {
				if (err) {
					toast.error('Something went wrong, try again later!');
				} else {
					toast.success(newUser.username + ' was successfully created!');
				}
			});

			this.props.closeModal();
		} else {
			/** We are editing an existing user */
			let oldUser = this.props.user;

			if (oldUser !== newUser) {
				if (oldUser._id === newUser._id) {
					let updatedUser = {};

					/** Only take attributes we want to update */
					for (let key of Object.keys(newUser)) {
						if (oldUser[key] !== newUser[key]) {
							updatedUser[key] = newUser[key];
						}
					}

					Meteor.call('users.update', oldUser._id, updatedUser, (err, res) => {
						if (err) {
							toast.error('Something went wrong, try again later!');
						} else {
							toast.success(newUser.username + ' was successfully updated!');
						}
					});

					this.props.closeModal();
				} else {
					/** The id of the new user differs from the old id */
					toast.error('Something went wrong, try again later!');
				}
			} else {
				/** No changes in the user */
				toast.error('Nothing to save!');
			}
		}
	}

	render() {
		let formRef;

		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>
					{this.props.user && this.props.user.username
						? 'Edit ' + this.props.user.username
						: 'Create a user'}
				</DialogTitle>

				<DialogContent>
					<AutoForm
						schema={bridge}
						model={this.props.user}
						ref={(ref) => (formRef = ref)}
						onSubmit={this.onSubmit}>
						<AutoFields />
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

export default ModalEditUser;
