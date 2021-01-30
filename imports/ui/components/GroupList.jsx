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
import GroupItem from '/imports/ui/components/GroupItem';

class GroupList extends React.Component {
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
								<GroupItem key={index} group={group} />
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

export default GroupList;
