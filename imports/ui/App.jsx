import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import HomeContainer from '/imports/ui/home/Home';
import LoginContainer from '/imports/ui/login/Login';
import AdminContainer from '/imports/ui/admin/Admin';
import ModalContainer from '/imports/ui/modal/ModalContainer';

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
	}

	render() {
		return (
			<ThemeProvider theme={darkTheme}>
				<Router>
					<HomeContainer path='/' />
					<LoginContainer path='/login' />
					<AdminContainer path='/admin' />
				</Router>

				<ModalContainer />

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
