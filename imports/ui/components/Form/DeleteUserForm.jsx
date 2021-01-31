import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

class DeleteUserForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>Delete {this.props.user.username} ?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your are going to delete {this.props.user.username}, are you sure you
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

export default DeleteUserForm;
