import { h, render, Component } from 'preact';
import { AccountService, translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import { connect } from 'store';
import { withRouter } from 'react-router-dom';
import { setToken } from 'core';

class LoginCard extends Component {
	state = {
		username: null,
		password: null,
		email: null,
		errorUsername: false,
		errorPassword: false,
		errorEmail: false
	}

	componentWillMount() {
		const { usernameInstapy } = this.props;
		this.setState({ username: usernameInstapy });
	}

	logout = e => {
		e.preventDefault();

		const { storeLogoutInstapy, history } = this.props;
		storeLogoutInstapy();
		localStorage.removeItem('token');
		setToken();
		history.push('/');
	}

	signup = async e => {
		e.preventDefault();

		const { email, username, password } = this.state;
		this.setState({
			errorEmail: !email,
			errorUsername: !username,
			errorPassword: !password
		});

		const { errorEmail, errorPassword, errorUsername } = this.state;
		if (errorPassword || errorUsername || errorEmail) return;

		const { storeLoginInstapy, history } = this.props;

		// save username and password
		const {
			token,
			displayName: usernameInstapy,
			error
		} = await AccountService.signupInstapy(email, username, password);

		if (!error) {
			storeLoginInstapy(token, usernameInstapy);
			localStorage.setItem('token', token);
			setToken(token);
			history.push('/dashboard');
			return;
		}

		// TODO handle error
		console.error(error);
	}

	login = async e => {
		// TODO handle this when pressing enter key
		e.preventDefault();

		const { username, password } = this.state;
		this.setState({
			errorUsername: !username,
			errorPassword: !password
		});

		const { errorPassword, errorUsername } = this.state;
		if (errorPassword || errorUsername) return;

		const { storeLoginInstapy, history } = this.props;

		// save username and password
		const {
			token,
			displayName: usernameInstapy,
			error
		} = await AccountService.loginInstapy(username, password);

		if (!error) {
			storeLoginInstapy(token, usernameInstapy);
			localStorage.setItem('token', token);
			setToken(token);
			history.push('/dashboard');
			return;
		}

		// TODO handle error
		console.error(error);
	}

	render(props, { username, password, email, errorPassword, errorUsername, errorEmail }) {
		const usernameClass = classNames({
			'form-control': true,
			'is-invalid': errorUsername
		});

		const emailClass = classNames({
			'form-control': true,
			'is-invalid': errorEmail
		});

		const passwordClass = classNames({
			'form-control': true,
			'is-invalid': errorPassword
		});

		return (
			<div className='card'>
				<form onSubmit={ this.login }>
					<div className='card-header'>
						{ translate('signup_title') }
					</div>
					<div className='card-body'>

						<div className='input-group'>
							<div className='input-group-prepend'>
								<i className='input-group-text fas fa-envelope' />
							</div>
							<input
								className={ emailClass }
								type='text'
								placeholder={ translate('login_email') }
								value={ email }
								onInput={ linkState(this, 'email') }
							/>
						</div>

						<div className='input-group'>
							<div className='input-group-prepend'>
								<i className='input-group-text fas fa-user' />
							</div>
							<input
								className={ usernameClass }
								type='text'
								placeholder={ translate('login_username') }
								value={ username }
								onInput={ linkState(this, 'username') }
							/>
						</div>

						<div className='input-group'>
							<div className='input-group-prepend'>
								<i className='input-group-text fas fa-lock' />
							</div>
							<input
								className={ passwordClass }
								type='password'
								placeholder={ translate('login_password') }
								value={ password }
								onInput={ linkState(this, 'password') }
							/>
						</div>

					</div>
					<div className='card-footer row align-items-center'>
						<div className='col'>
							<button type='submit' className='btn btn-outline-dark'>
								{ translate('button_login') }
							</button>
							<button
								className='btn btn-outline-dark'
								onClick={ this.signup }
								style={{ marginLeft: '15px' }}
							>
								{ translate('button_signup') }
							</button>
						</div>
						<div style={{ textAlign: 'right' }}>
							<button onClick={ this.logout } className='btn btn-outline-dark'>
								{ translate('button_logout') }
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(connect('usernameInstapy')(LoginCard));
