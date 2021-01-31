import React from 'react';
import { Meteor } from 'meteor/meteor';
import { navigate } from '@reach/router';
import {
	IconButton,
	Paper,
	InputBase,
	Grid,
	CircularProgress,
	Popover,
	withStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import BuildIcon from '@material-ui/icons/Build';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = (theme) => ({
	popover: {
		pointerEvents: 'none',
	},
	paper: {
		padding: theme.spacing(1),
	},
});

class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			input_filter: '',
			user_is_admin: false,
			anchorEl: null,
			popoverText: '',
		};

		this.checkUserIsAdmin = this.checkUserIsAdmin.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlePopoverClose = this.handlePopoverClose.bind(this);
		this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
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
				/**
				 * This will throw unstable_flushDiscreteUpdates if the user
				 * manually go to `/admin` while `/` is rendering.
				 *
				 * https://stackoverflow.com/questions/58123011/cryptic-react-error-unstable-flushdiscreteupdates-cannot-flush-updates-when-re
				 */
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

	handlePopoverOpen = (event) => {
		this.setState({
			anchorEl: event.currentTarget,
			popoverText: event.currentTarget.dataset.popover,
		});
	};

	handlePopoverClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const open = Boolean(this.state.anchorEl);

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
					onClick={() => this.props.openFormModal('edit_monitor', {})}
					data-popover='Create'
					onMouseEnter={this.handlePopoverOpen}
					onMouseLeave={this.handlePopoverClose}>
					<AddBoxIcon />
				</IconButton>
				{this.state.user_is_admin && (
					<IconButton
						onClick={async () => await navigate('/admin')}
						data-popover='Administration'
						onMouseEnter={this.handlePopoverOpen}
						onMouseLeave={this.handlePopoverClose}>
						<BuildIcon />
					</IconButton>
				)}
				<IconButton
					onClick={() => Meteor.logout()}
					data-popover='Logout'
					onMouseEnter={this.handlePopoverOpen}
					onMouseLeave={this.handlePopoverClose}>
					<ExitToAppIcon />
				</IconButton>
				<Popover
					className={this.props.classes.popover}
					classes={{
						paper: this.props.classes.paper,
					}}
					open={open}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					onClose={this.handlePopoverClose}
					disableRestoreFocus>
					{this.state.popoverText}
				</Popover>
			</Grid>
		);
	}
}

export default withStyles(useStyles)(Menu);
