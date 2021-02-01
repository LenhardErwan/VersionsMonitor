import React from 'react';
import {
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@material-ui/core';
import AdminItemGroup from '/imports/ui/admin/AdminItemGroup';

/**
 * List the groups.
 *
 * @param {{loading: Boolean, groups: Array, openFormModal: Function, handlePopoverClose: Function, handlePopoverOpen: Function}} props
 * @param {Boolean} loading Know if meteor is still fetching groups.
 * @param {Array} groups List of groups given by Meteor.
 * @param {Function} openFormModal Callback to open a modal.
 * @param {Function} handlePopoverClose Callback to close a popover.
 * @param {Function} handlePopoverOpen Callback to open a popover.
 */
class AdminListGroup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.loading ? (
							<TableRow>
								<TableCell colSpan='2' align='center'>
									<CircularProgress />
								</TableCell>
							</TableRow>
						) : this.props.groups.length > 0 ? (
							this.props.groups.map((group, index) => (
								<AdminItemGroup
									key={index}
									group={group}
									handleEdit={(group) =>
										this.props.openFormModal('edit_group', group)
									}
									handleDelete={(group) =>
										this.props.openFormModal('delete_group', group)
									}
									handlePopoverClose={this.props.handlePopoverClose}
									handlePopoverOpen={this.props.handlePopoverOpen}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan='2' align='center'>
									No group found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}

export default AdminListGroup;
