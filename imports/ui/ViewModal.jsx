import React from 'react';
import { Img } from 'react-image';
import {
	Button,
	Modal,
	Image,
	Loader,
	Table,
	Divider,
	Icon,
	Header,
	Message,
} from 'semantic-ui-react';

class ViewModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const monitor = this.props.monitor;

		if (monitor !== null) {
			return (
				<Modal closeIcon onClose={this.props.onClose} open={this.props.open}>
					<Modal.Header>
						<Image verticalAlign='middle' spaced='right'>
							<Img
								src={[
									monitor.icon_url,
									monitor.alternate_icon,
									'./images/no_image.svg',
								]}
								loader={<Loader active inline='centered' />}
							/>
						</Image>
						{monitor.name}
					</Modal.Header>

					<Modal.Content scrolling>
						{monitor.error && (
							<Message
								negative
								icon='exclamation triangle'
								header='Monitor in error :'
								content={monitor.error}></Message>
						)}

						<Divider horizontal>
							<Header as='h4'>
								<Icon name='sliders horizontal' />
								Properties
							</Header>
						</Divider>

						<Table celled striped>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell colSpan='2'>Attributes</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								<Table.Row>
									<Table.Cell collapsing>Name</Table.Cell>
									<Table.Cell collapsing textAlign='right'>
										{monitor.name}
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell collapsing>Url</Table.Cell>
									<Table.Cell collapsing textAlign='right'>
										{monitor.url}
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell collapsing>Selector</Table.Cell>
									<Table.Cell collapsing textAlign='right'>
										{monitor.selector}
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell collapsing>Regex</Table.Cell>
									<Table.Cell collapsing textAlign='right'>
										{monitor.regex ? monitor.regex : 'None'}
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell collapsing>Icon URL</Table.Cell>
									<Table.Cell collapsing textAlign='right'>
										{monitor.icon_url ? monitor.icon_url : 'None'}
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>

						<Divider horizontal></Divider>

						<Table celled striped>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell colSpan='2'>Headers</Table.HeaderCell>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell>Name</Table.HeaderCell>
									<Table.HeaderCell>Value</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{monitor.headers.lenght > 0 ? (
									monitor.headers.map((header, index) => {
										return (
											<Table.Row key={index}>
												<Table.Cell collapsing>{header.name}</Table.Cell>
												<Table.Cell collapsing textAlign='right'>
													{header.value}
												</Table.Cell>
											</Table.Row>
										);
									})
								) : (
									<Table.Row>
										<Table.Cell colSpan='2' textAlign='center'>
											None
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table>

						<Divider horizontal section>
							<Header as='h4'>
								<Icon name='tag' />
								Versions
							</Header>
						</Divider>

						<Table celled striped className='margin-last-table'>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Label</Table.HeaderCell>
									<Table.HeaderCell>
										Date ({this.props.date_format})
									</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{monitor.versions.length > 0 ? (
									monitor.versions.map((version, index) => {
										return (
											<Table.Row key={index}>
												<Table.Cell collapsing>{version.label}</Table.Cell>
												<Table.Cell collapsing textAlign='right'>
													{new Date(version.date).toLocaleString()}
												</Table.Cell>
											</Table.Row>
										);
									})
								) : (
									<Table.Row>
										<Table.Cell colSpan='2' textAlign='center'>
											None
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table>
					</Modal.Content>
					<Modal.Actions>
						<Button color='black' onClick={this.props.onClose}>
							Close
						</Button>
					</Modal.Actions>
				</Modal>
			);
		} else {
			return (
				<Modal closeIcon onClose={this.props.onClose} open={this.props.open}>
					<Modal.Content>No monitor is selected</Modal.Content>
				</Modal>
			);
		}
	}
}

export default ViewModal;
