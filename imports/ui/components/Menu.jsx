import React from 'react';
import { Meteor } from 'meteor/meteor';
import { navigate } from '@reach/router';
import {
	IconButton,
	Paper,
	InputBase,
	Grid,
	CircularProgress,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import BuildIcon from '@material-ui/icons/Build';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			input_filter: '',
			user_is_admin: false,
		};

		this.checkUserIsAdmin = this.checkUserIsAdmin.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	/**
	 * Because Meteor.call is async, if we don't assign _isMounted and check
	 * it's value, this.setState might be called after the component is set as
	 * Unmounted which will result in a Memory Leak.
	 */
	componentDidMount() {
		this._isMounted = true;
	}

	componentDidUpdate() {
		Meteor.call('user.isAdmin', this.checkUserIsAdmin);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	checkUserIsAdmin(err, res) {
		if (!err) {
			if (this._isMounted) {
				this.setState({ user_is_admin: res });
			}
		}
	}

	handleInputChange(event) {
		this.setState({
			input_filter: event.target.value,
		});

		this.props.setFilter(event.target.value);
	}

	render() {
		return (
			<Grid container direction='row' justify='flex-start' alignItems='center'>
				<Paper>
					<IconButton>
						{this.props.loading ? <CircularProgress /> : <SearchIcon />}
					</IconButton>
					<InputBase
						placeholder='Search...'
						onChange={this.handleInputChange}
						value={this.state.input_filter}
					/>
				</Paper>
				<IconButton
					onClick={() => this.props.openFormModal('edit_monitor', {})}>
					<AddBoxIcon />
				</IconButton>
				{this.state.user_is_admin && (
					<IconButton onClick={async () => await navigate('/admin')}>
						<BuildIcon />
					</IconButton>
				)}
				<IconButton onClick={() => Meteor.logout()}>
					<ExitToAppIcon />
				</IconButton>
			</Grid>
		);
	}
}
