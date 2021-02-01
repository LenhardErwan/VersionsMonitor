import React from 'react';
import {
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@material-ui/core';
import AdminItemGroup from '/imports/ui/admin/AdminItemGroup';

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