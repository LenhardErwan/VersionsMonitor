import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { navigate } from '@reach/router';
import { withTracker } from 'meteor/react-meteor-data';
import MonitorsCollection from '/imports/db/MonitorsCollection';
import HomeMenu from '/imports/ui/home/HomeMenu';
import HomeListMonitor from '/imports/ui/home/HomeListMonitor';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			filter: '',
			loading_filter: false,
			monitors: new Array(),
		};

		this.setFilter = this.setFilter.bind(this);
		this.filter = this.filter.bind(this);
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
			monitors: mlist,
			loading_filter: false,
		});
	}

	render() {
		return (
			<Fragment>
				<HomeMenu
					loading={this.state.loading_filter}
					setFilter={this.setFilter}
					handleOpenModal={this.props.handleOpenModal}
				/>

				<HomeListMonitor
					monitors={this.state.monitors}
					loading={this.props.loading}
					handleOpenModal={this.props.handleOpenModal}
				/>
			</Fragment>
		);
	}
}

const HomeContainer = withTracker(() => {
	const user = Meteor.user();

	if (user === null) {
		navigate('/login');
	}

	if (user !== undefined && user !== null) {
		Meteor.subscribe('user.groups', user._id);
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