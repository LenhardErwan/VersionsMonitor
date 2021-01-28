import React from 'react';

import EditMonitorForm from './forms/EditMonitorForm';
import DeleteMonitorForm from './forms/DeleteMonitorForm';

class FormModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.name == 'edit_monitor') {
			return (
				<EditMonitorForm
					isOpen={this.props.isOpen}
					monitor={this.props.param}
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
			)
		} else {
			return (
				null
			);
		}
	}
}

export default FormModal;
