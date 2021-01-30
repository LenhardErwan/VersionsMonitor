import React from 'react';

import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { monitor } from '/imports/db/schemas/monitor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';
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
			Meteor.call('monitors.insert', new_monitor, (err, res) => {
				if (err) {
					console.log(err);
					if (err.error === 'create.perms') {
						toast.error(err.reason);
					} else {
						toast.error('Something went wrong, try again later!');
					}
				} else {
					toast.success(new_monitor.name + ' was successfully updated!');
				}
			});
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

					Meteor.call(
						'monitors.update',
						old_monitor.id,
						updated_monitor,
						(err, res) => {
							if (err) {
								console.log(err);
								if (err.error === 'update.perms') {
									toast.error(err.reason);
								} else {
									toast.error('Something went wrong, try again later!');
								}
							} else {
								toast.success(new_monitor.name + ' was successfully updated!');
							}
						}
					);

					this.props.closeModal();
				} else {
					/** The id of the new monitor differs from the old id */
					toast.error('Something went wrong, try again later!');
				}
			} else {
				/** No changes in the monitor */
				toast.error('Nothing to save!');
			}
		}
	}

	// TODO find a way to find value and defaultValue error
	render() {
		let formRef;

		return (
			<Dialog onClose={this.props.closeModal} open={this.props.isOpen}>
				<DialogTitle>
					{this.props.monitor && this.props.monitor.name
						? 'Edit ' + this.props.monitor.name
						: 'Add an application'}
				</DialogTitle>
				<DialogContent>
					<AutoForm
						schema={bridge}
						model={this.props.monitor}
						ref={(ref) => (formRef = ref)}
						onSubmit={this.onSubmit}>
						<AutoFields omitFields={['versions', 'error']} />
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

export default EditMonitorForm;
