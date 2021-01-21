import React from 'react';
import EditMonitor from './forms/EditMonitor';

class FormModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<EditMonitor
				isOpen={this.props.isOpen}
				monitor={this.props.param}
				closeModal={this.props.closeModal}
			/>
		);
	}
}

export default FormModal;
