import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

import { monitor } from '/imports/api/schemas/monitor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-semantic';

const bridge = new SimpleSchema2Bridge(monitor);

class FormModal extends React.Component {
	constructor(props) {
		super(props);
	}

	onSubmit(monitor) {}

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
							onSubmit={this.onSubmit}>
							<AutoFields omitFields={['versions']} />
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
