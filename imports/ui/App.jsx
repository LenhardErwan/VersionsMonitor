import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ToastContainer, toast } from 'react-toastify';

import Menu from '/imports/ui/Menu.jsx';
import MonitorList from '/imports/ui/MonitorList.jsx';
import MonitorsCollection from '/imports/db/MonitorsCollection';
import FormModal from '/imports/ui/FormModal.jsx';
import Login from '/imports/ui/forms/Login.jsx';

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

		const cursor = MonitorsCollection.find();
		cursor.observe({
			added: (monitor) => this.addedMonitor(monitor),
			changed: (monitor) => this.changedMonitor(monitor),
			removed: (monitor) => this.removedMonitor(monitor),
		});

		this.setFilter = this.setFilter.bind(this);
		this.filter = this.filter.bind(this);
		this.openFormModal = this.openFormModal.bind(this);
		this.addedMonitor = this.addedMonitor.bind(this);
		this.changedMonitor = this.changedMonitor.bind(this);
		this.removedMonitor = this.removedMonitor.bind(this);
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
		const mlist = this.props.monitors.filter((monitor) =>
			monitor.name.toLowerCase().includes(filter.toLowerCase())
		);

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

	addedMonitor(monitor) {
		if (!this.state.loading) {
			// Don't trigger on start
			if (monitor.error !== null) {
				toast.error(`${monitor.name} has errors!`);
			} else {
				toast.success(`${monitor.name} has been added!`);
			}
		}
	}

	changedMonitor(monitor) {
		if (monitor.error !== null) {
			toast.error(`${monitor.name} has errors!`);
		} else {
			toast.success(`${monitor.name} has been updated!`);
		}
	}

	removedMonitor(monitor) {
		toast.success(`${monitor.name} has been removed!`);
	}

	render() {
		return (
			<div>
				{this.props.user ? (
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
						<ToastContainer
							position='top-right'
							autoClose={10000}
							hideProgressBar={false}
							newestOnTop
							closeOnClick={false}
							rtl={false}
							pauseOnFocusLoss
							draggable={false}
							pauseOnHover
						/>
					</div>
				) : (
					<div>
						<Login />
					</div>
				)}
			</div>
		);
	}
}

const AppContainer = withTracker(() => {
	const monitorsHandle = Meteor.subscribe('monitors.list');
	const loading = !monitorsHandle.ready();

	return {
		user: Meteor.user(),
		monitors: MonitorsCollection.find().fetch(),
		loading: loading,
	};
})(App);

export default AppContainer;
