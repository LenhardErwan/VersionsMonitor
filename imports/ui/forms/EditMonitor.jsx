import React from 'react';

import { Button, Modal } from 'semantic-ui-react';
import { monitor } from '/imports/db/schemas/monitor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-semantic';

const bridge = new SimpleSchema2Bridge(monitor);

class EditMonitor extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(new_monitor) {
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

				// TODO display success and refresh client list
				this.props.closeModal();
			} else {
				// TODO display error
				//console.log('monitorId is diff');
			}
		} else {
			// TODO display error
			//console.log('No diff');
		}
	}

	render() {
		let formRef;

		return (
			<Modal onClose={this.props.closeModal} open={this.props.isOpen}>
				<Modal.Header>Add a new application</Modal.Header>
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
						Nope
					</Button>
					<Button
						content="Yep, that's me"
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

export default EditMonitor;
