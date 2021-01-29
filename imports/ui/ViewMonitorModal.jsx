import React, { Fragment } from 'react';
import { Img } from 'react-image';
import { withStyles } from '@material-ui/core/styles';
import {
	Avatar,
	Button,
	Grid,
	CircularProgress,
	Dialog,
	Divider,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	avatar: {
		marginRight: theme.spacing(1),
	},
	itemSmTitle: {
		width: '75px',
		maxWidth: '75px',
	},
	itemMeTitle: {
		width: '100px',
		maxWidth: '100px',
	},
	itemLaTitle: {
		width: '170px',
		maxWidth: '170px',
	},
	itemText: {
		textAlign: 'left',
	},
});

class ViewMonitorModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const monitor = this.props.monitor;

		/** On startup, the monitor passed in props is `null` */
		if (monitor === null) {
			return null;
		} else {
			monitor.versions.sort((a, b) => {
				// Sort version by date (most recent on top)
				return b.date - a.date;
			});

			return (
				<Dialog onClose={this.props.onClose} open={this.props.open}>
					<MuiDialogTitle disableTypography className={this.props.classes.root}>
						<Grid container direction='row' alignItems='center'>
							<Avatar className={this.props.classes.avatar}>
								<Img
									src={[
										monitor.icon_url,
										monitor.alternate_icon,
										'./images/no_image.svg',
									]}
									loader={<CircularProgress />}
								/>
							</Avatar>
							<Typography variant='h6'>{monitor.name}</Typography>
						</Grid>
						<IconButton
							className={this.props.classes.closeButton}
							onClick={this.props.onClose}>
							<CloseIcon />
						</IconButton>
					</MuiDialogTitle>
					<MuiDialogContent dividers>
						<Grid container direction='column'>
							<Typography variant='h5'>Attributes</Typography>
							<List>
								<Divider />
								<ListItem>
									<ListItemText
										primary='Name'
										className={this.props.classes.itemMeTitle}
									/>
									<ListItemText
										primary={monitor.name}
										className={this.props.classes.itemText}
									/>
								</ListItem>
								<Divider />
								<ListItem>
									<ListItemText
										primary='Url'
										className={this.props.classes.itemMeTitle}
									/>
									<ListItemText
										primary={monitor.url}
										className={this.props.classes.itemText}
									/>
								</ListItem>
								<Divider />
								<ListItem>
									<ListItemText
										primary='Selector'
										className={this.props.classes.itemMeTitle}
									/>
									<ListItemText
										primary={monitor.selector}
										className={this.props.classes.itemText}
									/>
								</ListItem>
								<Divider />
								<ListItem>
									<ListItemText
										primary='Regex'
										className={this.props.classes.itemMeTitle}
									/>
									<ListItemText
										primary={monitor.regex ? monitor.regex : 'None'}
										className={this.props.classes.itemText}
									/>
								</ListItem>
								<Divider />
								<ListItem>
									<ListItemText
										primary='Icon Url'
										className={this.props.classes.itemMeTitle}
									/>
									<ListItemText
										primary={monitor.icon_url ? monitor.icon_url : 'None'}
										className={this.props.classes.itemText}
									/>
								</ListItem>
							</List>
							<Typography variant='h5'>Headers</Typography>
							<List>
								{monitor.headers.length > 0 ? (
									monitor.headers.map((header, index) => (
										<Fragment key={index}>
											<Divider />
											<ListItem>
												<ListItemText
													primary={header.name}
													className={this.props.classes.itemLaTitle}
												/>
												<ListItemText primary={header.value} />
											</ListItem>
										</Fragment>
									))
								) : (
									<ListItemText primary='No header' />
								)}
							</List>
							<Typography variant='h5'>Versions</Typography>
							<List>
								{monitor.versions.length > 0 ? (
									monitor.versions.map((version, index) => (
										<Fragment key={index}>
											<Divider />
											<ListItem>
												<ListItemText
													primary={version.label}
													className={this.props.classes.itemSmTitle}
												/>
												<ListItemText
													primary={new Date(version.date).toLocaleString()}
												/>
											</ListItem>
										</Fragment>
									))
								) : (
									<ListItemText primary='No version' />
								)}
							</List>
						</Grid>
					</MuiDialogContent>
				</Dialog>
			);
		}
	}
}

export default withStyles(styles)(ViewMonitorModal);
