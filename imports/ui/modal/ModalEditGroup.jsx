import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	InputLabel,
	MenuItem,
	Select,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { group } from '/imports/db/schemas/group';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoFields, AutoForm, ErrorsField } from 'uniforms-material';
import { toast } from 'react-toastify';

const bridge = new SimpleSchema2Bridge(group);

const TESTmonitors = new Array();
TESTmonitors.push({ id: 'E3EP7FxaFuwcYa4RW', name: 'VersionsMonitor' });
TESTmonitors.push({ id: 'jxcQmZaqTaqaKh9qA', name: 'BeerBrowser' });

class ModalEditGroup extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedMonitor: this.props.monitors
				? this.props.monitors
				: TESTmonitors[0].id,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
	}

	onSubmit(newGroup) {
		//TODO get modified field
		if (this.props.group._id == null) {
			Meteor.call('groups.insert', newGroup, (err, res) => {
				if (err) {
					if (err.error === 'perms.groups.insert') {
						toast.error(err.reason);
					} else {
						toast.error('Something went wrong, try again later!');
					}
				} else {
					toast.success(newGroup.name + ' was successfully created!');
				}
			});

			this.props.closeModal();
		} else {
			let oldGroup = this.props.group;

			if (oldGroup !== newGroup) {
				if (oldGroup._id === newGroup._id) {
					let updatedGroup = {};

					for (let key of Object.keys(newGroup)) {
						if (oldGroup[key] !== newGroup[key]) {
							updatedGroup[key] = newGroup[key];
						}
					}

					Meteor.call(
						'groups.update',
						oldGroup._id,
						updatedGroup,
						(err, res) => {
							if (err) {
								if (err.error === 'perms.groups.update') {
									toast.error(err.reason);
								} else {
									toast.error('Something went wrong, try again later!');
								}
							} else {
								toast.success(newGroup.name + ' was successfully updated!');
							}
						}
					);

					this.props.closeModal();
				} else {
					toast.error('Something went wrong, try again later!');
				}
			} else {
				toast.error('Nothing to save!');
			}
		}
	}

	handleSelectChange(event) {
		this.setState({
			selectedMonitor: event.target.value,
		});
	}

	render() {
		let formRef;
		const monitors = this.props.monitor ? this.props.monitor : TESTmonitors;

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
						ref={(ref) => (formRef = ref)}
						onSubmit={this.onSubmit}>
						<AutoFields omitFields={['multi']} />
						<ErrorsField />
						<InputLabel id='monitors-select-label'>Monitor</InputLabel>
						<Select
							labelId='monitors-select-label'
							id='monitors-select'
							onChange={this.handleSelectChange}
							value={this.state.selectedMonitor}>
							{monitors.map((monitor) => (
								<MenuItem value={monitor.id}>{monitor.name}</MenuItem>
							))}
						</Select>
						{/* Show monitor permissions and omit field in AutoForm */}
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

export default ModalEditGroup;
