import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import HomeContainer from '/imports/ui/Home';
import LoginContainer from '/imports/ui/Login';
import AdminContainer from '/imports/ui/Admin';
import ModalContainer from '/imports/ui/components/ModalContainer';

const darkTheme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			light: '#a6d4fa',
			main: '#90caf9',
			dark: '#648dae',
		},
	},
});

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalName: null,
			modalParam: null,
		};

		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleOpenModal(name, param) {
		this.setState({
			modalName: name,
			modalParam: param,
		});
	}

	handleCloseModal() {
		this.setState({
			modalName: null,
			modalParam: null,
		});
	}

	render() {
		return (
			<ThemeProvider theme={darkTheme}>
				<Router>
					<HomeContainer path='/' handleOpenModal={this.handleOpenModal} />
					<LoginContainer path='/login' />
					<AdminContainer
						path='/admin'
						handleOpenModal={this.handleOpenModal}
					/>
				</Router>

				<ModalContainer
					open={Boolean(this.state.modalName)}
					onClose={this.handleCloseModal}
					name={this.state.modalName}
					param={this.state.modalParam}
				/>

				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable={false}
					pauseOnHover
				/>
			</ThemeProvider>
		);
	}
}

export default App;
