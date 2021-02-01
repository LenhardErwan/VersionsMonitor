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
import HomeItemMonitor from '/imports/ui/home/HomeItemMonitor';

class HomeListMonitor extends React.Component {
	constructor(props) {
		super(props);
	}

	getDateFormatString() {
		const locale = window.navigator.userLanguage || window.navigator.language;
		const formatObj = new Intl.DateTimeFormat(locale).formatToParts();

		return formatObj
			.map((obj) => {
				switch (obj.type) {
					case 'second':
						return 'ss';
					case 'minute':
						return 'mm';
					case 'hour':
						return 'hh';
					case 'day':
						return 'DD';
					case 'month':
						return 'MM';
					case 'year':
						return 'YYYY';
					default:
						return obj.value;
				}
			})
			.join('');
	}

	render() {
		return (
			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Icon</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Newest version</TableCell>
							<TableCell>
								Discovery date <span>({this.getDateFormatString()})</span>
							</TableCell>
							<TableCell>Download</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.loading ? (
							<TableRow>
								<TableCell colSpan='6' align='center'>
									<CircularProgress />
								</TableCell>
							</TableRow>
						) : this.props.monitors.length > 0 ? (
							this.props.monitors.map((monitor, index) => (
								<HomeItemMonitor key={index} monitor={monitor} />
							))
						) : (
							<TableRow>
								<TableCell colSpan='6' align='center'>
									No monitor found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}

export default HomeListMonitor;
