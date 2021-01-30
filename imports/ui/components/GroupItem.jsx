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
					<IconButton size='small'>
						<EditIcon />
					</IconButton>
					<IconButton size='small'>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}
}

export default GroupItem;
