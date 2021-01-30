import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { toast } from 'react-toastify';
import { navigate } from '@reach/router';
import { Grid, TextField, Button, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
	formContainer: {
		margin: 'auto',
		maxWidth: '350px',
	},
	form: {
		padding: '10px',
		maxWidth: '330px',
	},
	input: {
		marginBottom: '10px',
	},
});

class Login extends React.Component {
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
			<Paper className={this.props.classes.formContainer}>
				<form onSubmit={this.submit} className={this.props.classes.form}>
					<Grid container direction='column'>
						<TextField
							className='input'
							label='Username'
							type='text'
							variant='outlined'
							className={this.props.classes.input}
							required
							onChange={(e) => this.setState({ username: e.target.value })}
						/>

						<TextField
							className='input'
							label='Password'
							type='password'
							variant='outlined'
							className={this.props.classes.input}
							required
							onChange={(e) => this.setState({ password: e.target.value })}
						/>

						<Button variant='contained' color='primary' type='submit'>
							Log In
						</Button>
					</Grid>
				</form>
			</Paper>
		);
	}
}

const LoginContainer = withTracker(() => {
	return {
		user: Meteor.user(),
	};
})(withStyles(styles)(Login));

export default LoginContainer;
