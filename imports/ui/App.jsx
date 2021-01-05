import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/Menu.jsx';
import MonitorList from '/imports/ui/MonitorList.jsx';
import MonitorsCollection from '/imports/db/MonitorsCollection';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monitors: new Array(),
			filter: '',
			loading: props.loading,
			loading_filter: false,
			monitor_list: new Array(),
		};

		this.setFilter = this.setFilter.bind(this);
		this.filter = this.filter.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.monitors !== this.props.monitors) {
			this.setState(
				{
					monitors: this.props.monitors,
				},
				() => {
					this.filter(this.state.filter);
				}
			);
		}

		if (prevProps.loading !== this.props.loading) {
			this.setState({
				loading: this.props.loading,
			});
		}
	}

	setFilter(filter) {
		this.setState({
			filter: filter,
			loading_filter: true,
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
			loading_filter: false,
		});
	}

	render() {
		return (
			<div>
				<Menu loading={this.state.loading_filter} setFilter={this.setFilter} />
				<MonitorList
					monitor_list={this.state.monitor_list}
					loading={this.state.loading}
				/>
			</div>
		);
	}
}

const AppContainer = withTracker(() => {
	const monitorsHandle = Meteor.subscribe('monitors.list');
	const loading = !monitorsHandle.ready();
	return {
		monitors: MonitorsCollection.find().fetch(),
		loading: loading,
	};
})(App);

export default AppContainer;
