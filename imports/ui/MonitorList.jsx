import React from 'react';
import { Loader } from 'semantic-ui-react';

import MonitorItem from '/imports/ui/MonitorItem.jsx';

export default class MonitorList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monitor_list: props.monitor_list,
		};

		this.getMonitorList = this.getMonitorList.bind(this);
	}

	getMonitorList() {
		if (this.state.monitor_list.length > 0) {
			return this.state.monitor_list.map((monitor) => {
				return <MonitorItem {...monitor} key={monitor._id} />;
			});
		} else {
			return (
				<tr>
					<td colSpan='6'>No monitors found</td>
				</tr>
			);
		}
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
		if (this.props.loading) {
			return <Loader active inline='centered' />;
		} else {
			return (
				<table>
					<thead>
						<tr>
							<th>Icon</th>
							<th>Name</th>
							<th>Newest version</th>
							<th>
								Discovery date <span>({this.getDateFormatString()})</span>
							</th>
							<th>Download</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>{this.getMonitorList()}</tbody>
				</table>
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
}
