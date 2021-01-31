import React from 'react';
import { IconButton, TableCell, TableRow } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

class AdminItemUser extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TableRow>
				<TableCell>{this.props.user.username}</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => this.props.handleEdit(this.props.user)}
						data-popover='Edit'
						onMouseEnter={this.props.handlePopoverOpen}
						onMouseLeave={this.props.handlePopoverClose}>
						<EditIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => this.props.handleDelete(this.props.user)}
						data-popover='Delete'
						onMouseEnter={this.props.handlePopoverOpen}
						onMouseLeave={this.props.handlePopoverClose}>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}
}

export default AdminItemUser;
