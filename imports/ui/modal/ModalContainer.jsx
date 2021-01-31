import React from 'react';
import ModalDeleteGroup from '/imports/ui/modal/ModalDeleteGroup';
import ModalDeleteMonitor from '/imports/ui/modal/ModalDeleteMonitor';
import ModalDeleteUser from '/imports/ui/modal/ModalDeleteUser';
import ModalEditGroup from '/imports/ui/modal/ModalEditGroup';
import ModalEditMonitor from '/imports/ui/modal/ModalEditMonitor';
import ModalEditUser from '/imports/ui/modal/ModalEditUser';
import ModalViewMonitor from '/imports/ui/modal/ModalViewMonitor';

class ModalContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
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
			)
		} else {
			return null;
		}
	}
}

export default ModalContainer;
