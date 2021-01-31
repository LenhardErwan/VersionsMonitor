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

class ModalEditGroup extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(newGroup) {
		if (this.props.group._id == null) {
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
			let oldGroup = this.props.group;

			if (oldGroup !== newGroup) {
				if (oldGroup._id === newGroup._id) {
					let updatedGroup = {};

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
