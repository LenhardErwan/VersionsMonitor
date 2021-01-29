import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import { navigate } from '@reach/router';
import { TextField, Button } from '@material-ui/core';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
		};

		this.submit = this.submit.bind(this);
	}

	async componentDidUpdate() {
		if (this.props.user) {
			await navigate('/');
		}
	}

	submit(event) {
		event.preventDefault();

		Meteor.loginWithPassword(
			this.state.username,
			this.state.password,
			(error) => {
				if (error) {
					toast.error(error.reason);
				}
			}
		);
	}

	render() {
		return (
			<form onSubmit={this.submit}>
				<TextField
					label='Username'
					type='text'
					variant='filled'
					required
					onChange={(e) => this.setState({ username: e.target.value })}
				/>

				<TextField
					label='password'
					type='password'
					variant='filled'
					required
					onChange={(e) => this.setState({ password: e.target.value })}
				/>

				<Button variant="contained" color='primary' type='submit'>Log In</Button>
			</form>
		);
	}
}

const LoginContainer = withTracker(() => {
	return {
		user: Meteor.user(),
	};
})(LoginForm);

export default LoginContainer;
