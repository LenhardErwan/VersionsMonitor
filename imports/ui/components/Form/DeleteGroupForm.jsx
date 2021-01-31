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

class DeleteGroupForm extends React.Component {
	constructor(props) {
		super(props);
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

export default DeleteGroupForm;
