import React from 'react';
import { Loader, Table } from 'semantic-ui-react';

import MonitorItem from '/imports/ui/MonitorItem.jsx';
import ViewMonitorModal from '/imports/ui/ViewMonitorModal.jsx';

export default class MonitorList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected_monitor: null,
			modal_view_monitor_open: false,
		};

		this.getMonitorList = this.getMonitorList.bind(this);
	}

	getMonitorList() {
		if (this.props.monitor_list.length > 0) {
			return this.props.monitor_list.map((monitor) => {
				return (
					<MonitorItem
						{...monitor}
						key={monitor._id}
						handleEdit={(monitor) =>
							this.props.openFormModal('edit_monitor', monitor)
						}
						handleDelete={(monitor) =>
							this.props.openFormModal('delete_monitor', monitor)
						}
						onView={(monitor) =>
							this.setState({
								selected_monitor: monitor,
								modal_view_monitor_open: true,
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

	render() {
		return (
			<div>
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
				</Table>
				<ViewMonitorModal
					monitor={this.state.selected_monitor}
					date_format={this.getDateFormatString()}
					open={this.state.modal_view_monitor_open}
					onClose={() => this.setState({ modal_view_monitor_open: false })}
				/>
			</div>
		);
	}
}
