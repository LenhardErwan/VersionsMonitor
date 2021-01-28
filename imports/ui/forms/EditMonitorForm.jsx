import React from 'react';

import { Button, Modal } from 'semantic-ui-react';
import { monitor } from '/imports/db/schemas/monitor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-semantic';
import { toast } from 'react-toastify';

const bridge = new SimpleSchema2Bridge(monitor);

/**
 * @param {Object} props
 * @param {monitor} props.monitor - Current monitor to be edited or null if we
 * are creating a new monitor
 * @param {Boolean} props.isOpen - Check if the modal is open
 * @param {Function} props.clodeModal - JS function to close the modal
 */
class EditMonitorForm extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(new_monitor) {
		if (this.props.monitor.id == null) {
			/** We are creating a new monitor */
			Meteor.call('monitors.insert', new_monitor);
			this.props.closeModal();
		} else {
			/** We are editing an existing monitor */
			let old_monitor = this.props.monitor;

			if (old_monitor !== new_monitor) {
				if (old_monitor.id === new_monitor.id) {
					let updated_monitor = {};

					for (let key of Object.keys(new_monitor)) {
						if (old_monitor[key] !== new_monitor[key]) {
							updated_monitor[key] = new_monitor[key];
						}
					}

					Meteor.call('monitors.update', old_monitor.id, updated_monitor);

					this.props.closeModal();
				} else {
					/** The id of the new monitor differs from the old id */
					toast.error('Something bad happened, try again later!');
				}
			} else {
				/** No changes in the monitor */
				toast.error('Nothing to save!');
			}
		}
	}

	render() {
		let formRef;

		return (
			<Modal onClose={this.props.closeModal} open={this.props.isOpen}>
				<Modal.Header>Edit an application</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<AutoForm
							schema={bridge}
							model={this.props.monitor}
							ref={(ref) => (formRef = ref)}
							onSubmit={this.onSubmit}>
							<AutoFields omitFields={['versions', 'error']} />
							<ErrorsField />
						</AutoForm>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button color='black' onClick={this.props.closeModal}>
						Cancel
					</Button>
					<Button
						content="Save"
						labelPosition='right'
						icon='checkmark'
						onClick={() => formRef.submit()}
						positive
					/>
				</Modal.Actions>
			</Modal>
		);
	}
}

export default EditMonitorForm;
