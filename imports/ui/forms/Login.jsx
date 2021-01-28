import { Meteor } from 'meteor/meteor';
import React from 'react';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: null,
			password: null,
		};

		this.submit = this.submit.bind(this);
	}

	submit(event) {
		event.preventDefault();

		Meteor.loginWithPassword(this.state.username, this.state.password);
		console.log('test');
	}

	render() {
		return (
			<form onSubmit={this.submit}>
				<label htmlFor='username'>Username</label>

				<input
					type='text'
					placeholder='Username'
					name='username'
					required
					onChange={(e) => this.setState({ username: e.target.value })}
				/>

				<label htmlFor='password'>Password</label>

				<input
					type='password'
					placeholder='Password'
					name='password'
					required
					onChange={(e) => this.setState({ password: e.target.value })}
				/>

				<button type='submit'>Log In</button>
			</form>
		);
	}
}

export default Login;