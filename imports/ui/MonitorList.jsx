import React from 'react';
import { Loader, Table } from 'semantic-ui-react';

import MonitorItem from '/imports/ui/MonitorItem.jsx';
import ViewModal from '/imports/ui/ViewModal.jsx';
import FormModal from '/imports/ui/FormModal.jsx';

export default class MonitorList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monitor_list: props.monitor_list,
			selected_monitor: null,
			modal_view_monitor_open: false,
			modal_edit_monitor_open: false,
		};

		this.getMonitorList = this.getMonitorList.bind(this);
	}

	getMonitorList() {
		if (this.state.monitor_list.length > 0) {
			return this.state.monitor_list.map((monitor) => {
				return (
					<MonitorItem
						{...monitor}
						key={monitor._id}
						onView={(monitor) =>
							this.setState({
								selected_monitor: monitor,
								modal_view_monitor_open: true,
							})
						}
						onEdit={(monitor) =>
							this.setState({
								selected_monitor: monitor,
								modal_edit_monitor_open: true,
							})
						}
					/>
				);
			});
		} else {
			return (
				<tr>
					<td colSpan='6'>No monitors found</td>
				</tr>
			);
		}
	}

	getDateFormatString() {
		const locale = window.navigator.userLanguage || window.navigator.language;
		const formatObj = new Intl.DateTimeFormat(locale).formatToParts();

		return formatObj
			.map((obj) => {
				switch (obj.type) {
					case 'second':
						return 'ss';
					case 'minute':
						return 'mm';
					case 'hour':
						return 'hh';
					case 'day':
						return 'DD';
					case 'month':
						return 'MM';
					case 'year':
						return 'YYYY';
					default:
						return obj.value;
				}
			})
			.join('');
	}

	static getDerivedStateFromProps(props, current_state) {
		if (props.monitor_list !== current_state.monitor_list) {
			return {
				monitor_list: props.monitor_list,
			};
		}

		return null;
	}

	render() {
		return (
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Icon</Table.HeaderCell>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Newest version</Table.HeaderCell>
						<Table.HeaderCell>
							Discovery date <span>({this.getDateFormatString()})</span>
						</Table.HeaderCell>
						<Table.HeaderCell>Download</Table.HeaderCell>
						<Table.HeaderCell>Actions</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{this.props.loading ? (
						<tr>
							<td colSpan='6'>
								<Loader active inline='centered' />
							</td>
						</tr>
					) : (
						this.getMonitorList()
					)}
				</Table.Body>
				<ViewModal
					monitor={this.state.selected_monitor}
					date_format={this.getDateFormatString()}
					open={this.state.modal_view_monitor_open}
					onClose={() => this.setState({ modal_view_monitor_open: false })}
				/>
				<FormModal
					monitor={this.state.selected_monitor}
					open={this.state.modal_edit_monitor_open}
					onClose={() => this.setState({ modal_edit_monitor_open: false })}
				/>
			</Table>
		);
	}
}
