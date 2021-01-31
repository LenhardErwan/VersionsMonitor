import React from 'react';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { group } from '/imports/db/schemas/group';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';

const bridge = new SimpleSchema2Bridge(group);

class EditGroupForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let formRef;

		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>
					{this.props.group && this.props.group.name
						? 'Edit ' + this.props.group.name
						: 'Create a group'}
				</DialogTitle>
				<DialogContent>
					<AutoForm
						schema={bridge}
						model={this.props.group}
						ref={(ref) => (formRef = ref)}>
						<AutoFields />
						<ErrorsField />
					</AutoForm>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.closeModal} variant='contained'>
						Cancel
					</Button>
					<Button
						onClick={() => formRef.submit()}
						variant='contained'
						color='primary'
						startIcon={<SaveIcon />}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default EditGroupForm;
