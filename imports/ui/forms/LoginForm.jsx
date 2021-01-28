import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Form } from 'semantic-ui-react';
import { toast } from 'react-toastify';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
		};

		this.submit = this.submit.bind(this);
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
			<Form onSubmit={this.submit}>
				<Form.Field>
					<label htmlFor='username'>Username</label>
					<input
						name='password'
						type='text'
						placeholder='Username'
						required
						onChange={(e) => this.setState({ username: e.target.value })}
					/>
				</Form.Field>

				<Form.Field>
					<label htmlFor='password'>Password</label>
					<input
						name='password'
						type='password'
						placeholder='Password'
						required
						onChange={(e) => this.setState({ password: e.target.value })}
					/>
				</Form.Field>

				<Button type='submit'>Log In</Button>
			</Form>
		);
	}
}

export default LoginForm;
