import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import AppContainer from '/imports/ui/App';
import LoginContainer from '/imports/ui/forms/LoginForm.jsx';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

Meteor.startup(() => {
	render(
		<Router>
			<AppContainer path='/' />
			<LoginContainer path='/login' />
		</Router>,
		document.getElementById('react-target')
	);
});
