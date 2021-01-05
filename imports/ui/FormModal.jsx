import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

import { monitor } from '/imports/db/schemas/monitor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-semantic';
import MonitorsCollection from '/imports/db/MonitorsCollection';

const bridge = new SimpleSchema2Bridge(monitor);

class FormModal extends React.Component {
	constructor(props) {
		super(props);
	}

	onSubmit(new_monitor) {
		let old_monitor = this.props.monitor;

		if (old_monitor !== new_monitor) {
			if (old_monitor.id === new_monitor.id) {
				Meteor.call('monitors.update', old_monitor.id, new_monitor);

				// TODO display success
			} else {
				// TODO display error
				//console.log('monitorId is diff');
			}
		} else {
			// TODO display error
			//console.log('No diff');
		}

		// TODO find how to refresh the client list
		this.props.onClose();
	}

	render() {
		let formRef;

		return (
			<Modal onClose={this.props.onClose} open={this.props.open}>
				<Modal.Header>Add a new application</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<AutoForm
							schema={bridge}
							model={this.props.monitor}
							ref={(ref) => (formRef = ref)}
							onSubmit={this.onSubmit.bind(this)}>
							<AutoFields omitFields={['versions', 'error']} />
							<ErrorsField />
						</AutoForm>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button color='black' onClick={this.props.onClose}>
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

export default FormModal;
