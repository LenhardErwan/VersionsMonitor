import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import AppContainer from '/imports/ui/App';
import 'semantic-ui-css/semantic.min.css';

Meteor.startup(() => {
	render(<AppContainer />, document.getElementById('react-target'));
});
