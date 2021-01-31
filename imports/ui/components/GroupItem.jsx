import React from 'react';
import { IconButton, TableCell, TableRow } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

class GroupItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TableRow>
				<TableCell>{this.props.group.name}</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => this.props.handleEdit(this.props.group)}
						data-popover='Edit'
						onMouseEnter={this.props.handlePopoverOpen}
						onMouseLeave={this.props.handlePopoverClose}>
						<EditIcon />
					</IconButton>
					<IconButton
						size='small'
						onClick={() => this.props.handleDelete(this.props.group)}
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

export default GroupItem;
