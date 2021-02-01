import React from 'react';
import { IconButton, TableCell, TableRow } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

/**
 * An item displayed in the AdminListGroup.
 *
 * @param {{group: Object, handleEdit: Function, handleDelete: Function, handlePopoverClose: Function, handlePopoverOpen: Function}} props
 * @param {Object} props.group The group this item will display.
 * @param {Function} props.handleEdit Callback to open the `edit_group` modal.
 * @param {Function} props.handleDelete Callback to open the `delete_group` modal.
 * @param {Function} props.handlePopoverClose Callback to close a popover.
 * @param {Function} props.handlePopoverOpen Callback to open a popover.
 */
class AdminItemGroup extends React.Component {
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

export default AdminItemGroup;
