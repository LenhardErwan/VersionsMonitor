import React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { user } from '/imports/db/schemas/user';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';

const bridge = new SimpleSchema2Bridge(user);

class EditUserForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let formRef;

		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>
					{this.props.user && this.props.user.username
						? 'Edit ' + this.props.user.username
						: 'Create a user'}
				</DialogTitle>
				<DialogContent>
					<AutoForm
						schema={bridge}
						model={this.props.user}
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

export default EditUserForm;
