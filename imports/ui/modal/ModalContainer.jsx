import React from 'react';
import ModalDeleteGroup from '/imports/ui/modal/ModalDeleteGroup';
import ModalDeleteMonitor from '/imports/ui/modal/ModalDeleteMonitor';
import ModalDeleteUser from '/imports/ui/modal/ModalDeleteUser';
import ModalEditGroup from '/imports/ui/modal/ModalEditGroup';
import ModalEditMonitor from '/imports/ui/modal/ModalEditMonitor';
import ModalEditUser from '/imports/ui/modal/ModalEditUser';
import ModalViewMonitor from '/imports/ui/modal/ModalViewMonitor';

/**
 * Displays the specified modal on the screen.
 *
 * @param {{name: String, param: Object, open: Boolean, onClose: Function}} props
 * @param {String} props.name The name of the modal currently displayed.
 * @param {Object} props.param An object to pass to the modal can be: `Group`, `Monitor`, `User`.
 * @param {Boolean} props.open Know if the modal is open.
 * @param {Function} props.onClose Callback to close the modal.
 */
class ModalContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		/** Check which modal we want to display */
		if (this.props.name == 'delete_group') {
			return (
				<ModalDeleteGroup
					isOpen={this.props.open}
					group={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'delete_monitor') {
			return (
				<ModalDeleteMonitor
					isOpen={this.props.open}
					monitor={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'delete_user') {
			return (
				<ModalDeleteUser
					isOpen={this.props.open}
					user={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'edit_group') {
			return (
				<ModalEditGroup
					isOpen={this.props.open}
					group={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'edit_monitor') {
			return (
				<ModalEditMonitor
					isOpen={this.props.open}
					monitor={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'edit_user') {
			return (
				<ModalEditUser
					isOpen={this.props.open}
					user={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'view_monitor') {
			return (
				<ModalViewMonitor
					open={this.props.open}
					monitor={this.props.param}
					onClose={this.props.onClose}
				/>
			);
		} else {
			return null;
		}
	}
}

export default ModalContainer;
