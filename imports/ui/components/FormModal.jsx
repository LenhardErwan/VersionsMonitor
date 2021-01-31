import React from 'react';
import EditGroupForm from './Form/EditGroupForm';
import EditMonitorForm from '/imports/ui/components/Form/EditMonitorForm';
import EditUserForm from '/imports/ui/components/Form/EditUserForm';
import DeleteGroupForm from '/imports/ui/components/Form/DeleteGroupForm';
import DeleteMonitorForm from '/imports/ui/components/Form/DeleteMonitorForm';
import DeleteUserForm from '/imports/ui/components/Form/DeleteUserForm';

class FormModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.name == 'edit_group') {
			return (
				<EditGroupForm
					isOpen={this.props.isOpen}
					group={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else if (this.props.name == 'edit_monitor') {
			return (
				<EditMonitorForm
					isOpen={this.props.isOpen}
					monitor={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else if (this.props.name == 'edit_user') {
			return (
				<EditUserForm
					isOpen={this.props.isOpen}
					user={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else if (this.props.name == 'delete_group') {
			return (
				<DeleteGroupForm
					isOpen={this.props.isOpen}
					group={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else if (this.props.name == 'delete_monitor') {
			return (
				<DeleteMonitorForm
					isOpen={this.props.isOpen}
					monitor={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else if (this.props.name == 'delete_user') {
			return (
				<DeleteUserForm
					isOpen={this.props.isOpen}
					user={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else {
			return null;
		}
	}
}

export default FormModal;
