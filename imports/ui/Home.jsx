import React from 'react';
import { Meteor } from 'meteor/meteor';
import { navigate } from '@reach/router';
import { withTracker } from 'meteor/react-meteor-data';
import MonitorsCollection from '/imports/db/MonitorsCollection';
import Menu from '/imports/ui/components/Menu';
import MonitorList from '/imports/ui/components/MonitorList';
import FormModal from '/imports/ui/components/FormModal';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: '',
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
		/**
		 * Avoids memory leak while filtering when the component is not
		 * mounted.
		 *
		 * https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
		 */
		if (this._isMounted) {
			if (prevProps.monitors !== this.props.monitors) {
				this.filter(this.state.filter);
			}
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
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
					loading={this.props.loading}
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

const HomeContainer = withTracker(() => {
	const user = Meteor.user();

	if (user === null) {
		navigate('/login');
	}

	if (user !== undefined && user !== null) {
		Meteor.subscribe('Meteor.users.groups', user._id);
	}

	const monitorsHandle = Meteor.subscribe(
		'monitors.list',
		user && user.groups ? user.groups : ['everyone']
	);

	const loading = !monitorsHandle.ready();

	return {
		user: user,
		monitors: MonitorsCollection.find().fetch(),
		loading: loading,
	};
})(Home);

export default HomeContainer;
