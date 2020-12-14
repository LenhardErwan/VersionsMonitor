import React from 'react';

export default class MonitorList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monitor_list: props.monitor_list,
		};
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
		return <div>I'm MonitorList</div>;
	}
}
