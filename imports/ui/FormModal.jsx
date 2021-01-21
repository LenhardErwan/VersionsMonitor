import React from 'react';

import EditMonitor from './forms/EditMonitor';
import DeleteMonitor from './forms/DeleteMonitor';

class FormModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.name == 'edit_monitor') {
			return (
				<EditMonitor
					isOpen={this.props.isOpen}
					monitor={this.props.param}
					closeModal={this.props.closeModal}
				/>
			);
		} else if (this.props.name == 'delete_monitor') {
			return (
				<DeleteMonitor
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
