import { h, render, Component } from 'preact';
import { AccountService, translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import { connect } from 'store';
import { withRouter } from 'react-router-dom';

class LoginCard extends Component {
	state = {
		username: null,
		password: null,
		errorUsername: false,
		errorPassword: false
	}

	componentWillMount() {
		const { username } = this.props;
		this.setState({ username });
	}

	logout = e => {
		e.preventDefault();

		const { setUsername, history } = this.props;

		AccountService.setLoginCredentials('', '');
		setUsername('');
		history.push('/');
	}

	login = e => {
		// TODO handle this when pressing enter key
		e.preventDefault();

		const { username, password } = this.state;
		this.setState({
			errorUsername: !username,
			errorPassword: !password
		});

		const { errorPassword, errorUsername } = this.state;
		if (errorPassword || errorUsername) return;

		const { setUsername, history } = this.props;

		// save username and password
		AccountService.setLoginCredentials(username, password);
		setUsername(username);
		history.push('/');
	}

	render(props, { username, password, errorPassword, errorUsername }) {
		const usernameClass = classNames({
			'form-control': true,
			'is-invalid': errorUsername
		});

		const passwordClass = classNames({
			'form-control': true,
			'is-invalid': errorPassword
		});

		return (
			<div className='card'>
				<form onSubmit={ this.login }>
					<div className='card-header'>
						{ translate('login_title') }
					</div>
					<div className='card-body'>

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

export default withRouter(connect('username')(LoginCard));
