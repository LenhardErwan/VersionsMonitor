import React from 'react';

import { Button, Modal } from 'semantic-ui-react';

/**
 * @param {Object} props
 * @param {monitor} props.monitor - The selected monitor
 * @param {Boolean} props.isOpen - Check if the modal is open
 * @param {Function} props.closeModal - Method to close the modal
 */
class DeleteMonitor extends React.Component {
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
			<Modal onClose={this.props.closeModal} open={this.props.isOpen}>
				<Modal.Header>Delete {this.props.monitor.name} ?</Modal.Header>
				<Modal.Content>Are you sure you want to delete {this.props.monitor.name} ?</Modal.Content>
				<Modal.Actions>
					<Button color='black' onClick={this.props.closeModal}>
						No
					</Button>
					<Button
						content="Yes"
						labelPosition='right'
						icon='checkmark'
						onClick={this.onConfirm}
						positive
					/>
				</Modal.Actions>
			</Modal>
		);
	}
}

export default DeleteMonitor;
