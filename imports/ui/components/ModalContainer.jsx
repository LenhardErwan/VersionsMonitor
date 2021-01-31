import React from 'react';
import EditGroupForm from './Form/EditGroupForm';
import EditMonitorForm from '/imports/ui/components/Form/EditMonitorForm';
import EditUserForm from '/imports/ui/components/Form/EditUserForm';
import DeleteGroupForm from '/imports/ui/components/Form/DeleteGroupForm';
import DeleteMonitorForm from '/imports/ui/components/Form/DeleteMonitorForm';
import DeleteUserForm from '/imports/ui/components/Form/DeleteUserForm';
import ViewMonitorModal from '/imports/ui/components/ViewMonitorModal';

class ModalContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.name == 'edit_group') {
			return (
				<EditGroupForm
					isOpen={this.props.open}
					group={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'edit_monitor') {
			return (
				<EditMonitorForm
					isOpen={this.props.open}
					monitor={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'edit_user') {
			return (
				<EditUserForm
					isOpen={this.props.open}
					user={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'delete_group') {
			return (
				<DeleteGroupForm
					isOpen={this.props.open}
					group={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'delete_monitor') {
			return (
				<DeleteMonitorForm
					isOpen={this.props.open}
					monitor={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'delete_user') {
			return (
				<DeleteUserForm
					isOpen={this.props.open}
					user={this.props.param}
					closeModal={this.props.onClose}
				/>
			);
		} else if (this.props.name == 'view_monitor') {
			return (
				<ViewMonitorModal
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
