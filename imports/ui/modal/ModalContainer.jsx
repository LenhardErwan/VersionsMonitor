import React from 'react';
import ModalDeleteGroup from '/imports/ui/modal/ModalDeleteGroup';
import ModalDeleteMonitor from '/imports/ui/modal/ModalDeleteMonitor';
import ModalDeleteUser from '/imports/ui/modal/ModalDeleteUser';
import ModalEditGroup from '/imports/ui/modal/ModalEditGroup';
import ModalEditMonitor from '/imports/ui/modal/ModalEditMonitor';
import ModalEditUser from '/imports/ui/modal/ModalEditUser';
import ModalViewMonitor from '/imports/ui/modal/ModalViewMonitor';

class ModalContainer extends React.Component {
	static modalName = null;
	static param = null;
	static instance = null;

	constructor(props) {
		super(props);

		this.state = {
			name: ModalContainer.modalName,
			param: ModalContainer.param,
		};

		ModalContainer.instance = this;
	}

	static openModal(name, param) {
		if (ModalContainer.instance !== null) {
			if (ModalContainer.modalName === null) {
				ModalContainer.modalName = name;
				ModalContainer.param = param;

				ModalContainer.instance.setState({
					name: name,
					param: param,
				});
			} else {
				console.error('Modal container already open');
			}
		} else {
			console.error('No modal container!');
		}
	}

	static closeModal() {
		if (ModalContainer.instance !== null) {
			ModalContainer.modalName = null;
			ModalContainer.param = null;

			ModalContainer.instance.setState({
				name: null,
				param: null,
			});
		} else {
			console.error('There are no container!');
		}
	}

	render() {
		if (this.state.name == 'delete_group') {
			return (
				<ModalDeleteGroup
					isOpen={Boolean(this.state.name)}
					group={this.state.param}
					closeModal={ModalContainer.closeModal}
				/>
			);
		} else if (this.state.name == 'delete_monitor') {
			return (
				<ModalDeleteMonitor
					isOpen={Boolean(this.state.name)}
					monitor={this.state.param}
					closeModal={ModalContainer.closeModal}
				/>
			);
		} else if (this.state.name == 'delete_user') {
			return (
				<ModalDeleteUser
					isOpen={Boolean(this.state.name)}
					user={this.state.param}
					closeModal={ModalContainer.closeModal}
				/>
			);
		} else if (this.state.name == 'edit_group') {
			return (
				<ModalEditGroup
					isOpen={Boolean(this.state.name)}
					group={this.state.param}
					closeModal={ModalContainer.closeModal}
				/>
			);
		} else if (this.state.name == 'edit_monitor') {
			return (
				<ModalEditMonitor
					isOpen={Boolean(this.state.name)}
					monitor={this.state.param}
					closeModal={ModalContainer.closeModal}
				/>
			);
		} else if (this.state.name == 'edit_user') {
			return (
				<ModalEditUser
					isOpen={Boolean(this.state.name)}
					user={this.state.param}
					closeModal={ModalContainer.closeModal}
				/>
			);
		} else if (this.state.name == 'view_monitor') {
			return (
				<ModalViewMonitor
					open={Boolean(this.state.name)}
					monitor={this.state.param}
					onClose={ModalContainer.closeModal}
				/>
			);
		} else {
			return null;
		}
	}
}

export default ModalContainer;
