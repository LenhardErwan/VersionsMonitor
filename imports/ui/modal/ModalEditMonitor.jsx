import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { monitor } from '/imports/db/schemas/monitor';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';
import { toast } from 'react-toastify';

const bridge = new SimpleSchema2Bridge(monitor);

/**
 * Form to create or edit the given `Monitor`.
 *
 * @param {{isOpen: Boolean, monitor: Object, closeModal: Function}} props
 * @param {Boolean} props.isOpen Know if the modal is open.
 * @param {Object} props.monitor The `Monitor` we are going to edit.
 * @param {Function} props.closeModal Callback to close the modal.
 */
class ModalEditMonitor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			preview: undefined,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.handlePreview = this.handlePreview.bind(this);
		this.handleCloseChip = this.handleCloseChip.bind(this);
	}

	onSubmit(new_monitor) {
		if (this.props.monitor._id == null) {
			/** We are creating a new monitor */
			Meteor.call('monitors.insert', new_monitor, (err, res) => {
				if (err) {
					console.log(err);
					if (err.error === 'perms.monitors.insert') {
						toast.error(err.reason);
					} else {
						toast.error('Something went wrong, try again later!');
					}
				} else {
					toast.success(new_monitor.name + ' was successfully created!');
				}
			});

			this.props.closeModal();
		} else {
			/** We are editing an existing monitor */
			let old_monitor = this.props.monitor;

			if (old_monitor !== new_monitor) {
				if (old_monitor._id === new_monitor._id) {
					let updated_monitor = {};

					for (let key of Object.keys(new_monitor)) {
						if (old_monitor[key] !== new_monitor[key]) {
							updated_monitor[key] = new_monitor[key];
						}
					}

					Meteor.call(
						'monitors.update',
						old_monitor._id,
						updated_monitor,
						(err, res) => {
							if (err) {
								if (err.error === 'perms.monitors.update') {
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

	handlePreview(ref) {
		const data = ref.state.model;

		Meteor.call(
			'monitors.preview',
			{
				url: data.url,
				selector: data.selector,
				regex: data.regex,
				headers: data.headers,
			},
			(err, res) => {
				if (err) {
					toast.error(err.reason);
				} else {
					this.setState({
						preview: res,
					});
				}
			}
		);
	}

	handleCloseChip() {
		this.setState({
			preview: undefined,
		});
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
					{this.state.preview && (
						<Chip
							onDelete={this.handleCloseChip}
							icon={<LocalOfferIcon />}
							label={this.state.preview}
						/>
					)}
					<Button
						onClick={() => this.handlePreview(formRef)}
						variant='contained'
						color='secondary'>
						Preview
					</Button>

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

export default ModalEditMonitor;
