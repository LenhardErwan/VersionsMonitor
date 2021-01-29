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

/**
 * @param {Object} props
 * @param {monitor} props.monitor - The selected monitor
 * @param {Boolean} props.isOpen - Check if the modal is open
 * @param {Function} props.closeModal - Method to close the modal
 */
class DeleteMonitorForm extends React.Component {
	constructor(props) {
		super(props);

		this.onConfirm = this.onConfirm.bind(this);
	}

	onConfirm() {
		Meteor.call('monitors.delete', this.props.monitor.id);
		this.props.closeModal();
	}

	render() {
		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>Delete {this.props.monitor.name} ?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your are going to delete {this.props.monitor.name}, are you sure you
						want to do this ?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={this.props.closeModal}
						variant='contained'>
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

export default DeleteMonitorForm;
