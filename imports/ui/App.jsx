import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/Menu.jsx';
import MonitorList from '/imports/ui/MonitorList.jsx';
import MonitorsCollection from '/imports/api/MonitorsCollection';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monitors: new Array(),
			filter: '',
			loaded: true,
			monitor_list: new Array(),
		};

		this.setFilter = this.setFilter.bind(this);
		this.filter = this.filter.bind(this);
	}

	static getDerivedStateFromProps(props, current_state) {
		if (current_state.monitor_list !== props.monitors) {
			return {
				monitors: props.monitors,
				monitor_list: props.monitors,
			};
		}

		return null;
	}

	setFilter(filter) {
		this.setState({
			filter: filter,
			loaded: false,
		});
		this.filter(filter);
	}

	filter(filter) {
		const mlist = new Array();
		for (const monitor of this.state.monitors) {
			if (monitor.name.toLowerCase().includes(filter.toLowerCase()))
				mlist.push(monitor);
		}
		this.setState({
			monitor_list: mlist,
		});
	}

	render() {
		return (
			<div>
				<Menu loaded={this.state.loaded} setFilter={this.setFilter} />
				<MonitorList monitor_list={this.state.monitor_list} />
			</div>
		);
	}
}

const AppContainer = withTracker(() => {
	return {
		monitors: MonitorsCollection.find().fetch(),
	};
})(App);

export default AppContainer;
