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
import AdminItemUser from '/imports/ui/admin/AdminItemUser';

class AdminListUser extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Username</TableCell>
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
						) : this.props.users.length > 0 ? (
							this.props.users.map((user, index) => (
								<AdminItemUser
									key={index}
									user={user}
									handleEdit={(user) =>
										this.props.openFormModal('edit_user', user)
									}
									handleDelete={(user) =>
										this.props.openFormModal('delete_user', user)
									}
									handlePopoverOpen={this.props.handlePopoverOpen}
									handlePopoverClose={this.props.handlePopoverClose}
								/>
							))
						) : (
							<TableRow>
								<TableCell colSpan='2' align='center'>
									No user found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}

export default AdminListUser;
