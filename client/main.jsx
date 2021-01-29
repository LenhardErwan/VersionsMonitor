import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import AppContainer from '/imports/ui/App';
import LoginContainer from '/imports/ui/forms/LoginForm';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

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

Meteor.startup(() => {
	render(
		<ThemeProvider theme={darkTheme}>
			<Router>
				<AppContainer path='/' />
				<LoginContainer path='/login' />
			</Router>
		</ThemeProvider>,
		document.getElementById('react-target')
	);
});
