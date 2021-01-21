import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/Menu.jsx';
import MonitorList from '/imports/ui/MonitorList.jsx';
import MonitorsCollection from '/imports/db/MonitorsCollection';
import FormModal from '/imports/ui/FormModal.jsx';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monitors: new Array(),
			filter: '',
			loading: props.loading,
			loading_filter: false,
			monitor_list: new Array(),
			fmodal_name: null,
			fmodal_param: null,
			is_fmodal_open: false,
		};

		this.setFilter = this.setFilter.bind(this);
		this.filter = this.filter.bind(this);
		this.openFormModal = this.openFormModal.bind(this);
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

	openFormModal(name, param) {
		this.setState({
			fmodal_name: name,
			fmodal_param: param,
			is_fmodal_open: true,
		});
	}

	render() {
		return (
			<div>
				<Menu
					loading={this.state.loading_filter}
					setFilter={this.setFilter}
					openFormModal={this.openFormModal}
				/>
				<MonitorList
					monitor_list={this.state.monitor_list}
					loading={this.state.loading}
					openFormModal={this.openFormModal}
				/>
				<FormModal
					isOpen={this.state.is_fmodal_open}
					closeModal={() => this.setState({ is_fmodal_open: false })}
					name={this.state.fmodal_name}
					param={this.state.fmodal_param}
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
