import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import AppContainer from '/imports/ui/App';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

Meteor.startup(() => {
	render(<AppContainer />, document.getElementById('react-target'));
});
