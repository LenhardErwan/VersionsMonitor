import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { toast } from 'react-toastify';

/**
 * Confirmation form to delete the given `Group`.
 *
 * @param {{isOpen: Boolean, group: Object, closeModal: Function}} props
 * @param {Boolean} props.isOpen Know if the modal is open.
 * @param {Object} props.group The `Group` we are going to delete.
 * @param {Function} props.closeModal Callback to close the modal.
 */
class ModalDeleteGroup extends React.Component {
	constructor(props) {
		super(props);

		this.onConfirm = this.onConfirm.bind(this);
	}

	onConfirm() {
		Meteor.call('groups.delete', this.props.group._id, (err, res) => {
			if (err) {
				if (err.error === 'perms.groups.delete') {
					toast.error(err.reason);
				} else {
					toast.error('Something went wrong, try again later!');
				}
			} else {
				toast.success(this.props.group.name + ' was successfully delete!');
			}
		});

		this.props.closeModal();
	}

	render() {
		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>Delete {this.props.group.name} ?</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Your are going to delete {this.props.group.name}, are you sure you
						want to do this ?
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={this.props.closeModal} variant='contained'>
						Cancel
					</Button>

					<Button
						onClick={this.onConfirm}
						startIcon={<CheckIcon />}
						variant='contained'
						color='primary'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default ModalDeleteGroup;
