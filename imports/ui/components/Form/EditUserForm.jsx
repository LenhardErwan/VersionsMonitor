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

class EditUserForm extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(newUser) {
		if (this.props.user._id == null) {
			Meteor.call('users.insert', newUser, (err, res) => {
				if (err) {
					toast.error('Something went wrong, try again later!');
				} else {
					toast.success(newUser.username + ' was successfully created!');
				}
			});

			this.props.closeModal();
		} else {
			let oldUser = this.props.user;

			if (oldUser !== newUser) {
				if (oldUser._id === newUser._id) {
					let updatedUser = {};

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
					toast.error('Something went wrong, try again later!');
				}
			} else {
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

export default EditUserForm;
