import React from 'react';
import {
	IconButton,
	Paper,
	InputBase,
	Grid,
	CircularProgress,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			input_filter: '',
		};

		this.handleInputChange = this.handleInputChange.bind(this);
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
				<IconButton onClick={() => Meteor.logout()}>
					<ExitToAppIcon />
				</IconButton>
			</Grid>
		);
	}
}
