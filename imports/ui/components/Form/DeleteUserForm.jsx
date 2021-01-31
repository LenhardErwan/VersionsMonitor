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

class DeleteUserForm extends React.Component {
	constructor(props) {
		super(props);

		this.onConfirm = this.onConfirm.bind(this);
	}

	onConfirm() {
		Meteor.call('users.delete', this.props.user._id, (err, res) => {
			if (err) {
				toast.error('Something went wrong, try again later!');
			} else {
				toast.success(this.props.user.username + ' was successfully deleted!');
			}
		});

		this.props.closeModal();
	}

	render() {
		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>Delete {this.props.user.username} ?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your are going to delete {this.props.user.username}, are you sure
						you want to do this ?
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

export default DeleteUserForm;
