import React from 'react';
import { Img } from 'react-image';

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
				return (
					<tr key={monitor._id}>
						<td>
							<Img
								src={[
									monitor.image,
									`${new URL(monitor.url).origin}/favicon.ico`,
									'./images/no-image.svg',
								]}
							/>
						</td>
						<td>{monitor.name}</td>
						<td>
							{monitor.versions[0]
								? monitor.versions[0].label
								: 'No version label'}
						</td>
						<td>
							{monitor.versions[0]
								? monitor.versions[0].label
								: 'No version date'}
						</td>
						<td>
							<a
								href={monitor.url}
								onClick={(event) => {
									event.preventDefault();
									const win = window.open(monitor.url, '_blank');
									win.focus();
								}}>
								Link
							</a>
						</td>
						<td>TODO</td>
					</tr>
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
