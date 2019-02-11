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

	save = e => {
		e.preventDefault();

		const { username, password } = this.state;
		this.setState({
			errorUsername: !username,
			errorPassword: !password
		});

		const { errorPassword, errorUsername } = this.state;
		if (errorPassword || errorUsername) return;

		const { setUsername, history } = this.props;
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
			<div class="card">
				<form>
					<div class="card-header">
						{ translate('login_title') }
					</div>
					<div class="card-body">

						<div className="input-group">
							<div className="input-group-prepend">
								<i className="input-group-text fas fa-user"></i>
							</div>
							<input
								class={ usernameClass }
								type="text"
								placeholder={ translate('login_username') }
								value={ username }
								onInput={ linkState(this, 'username') }
							/>
						</div>

						<div className="input-group">
							<div className="input-group-prepend">
								<i className="input-group-text fas fa-key"></i>
							</div>
							<input
								class={ passwordClass }
								type="password"
								placeholder={ translate('login_password') }
								value={ password }
								onInput={ linkState(this, 'password') }
							/>
						</div>

					</div>
					<div className="card-footer" style='text-align: right;'>
						<button type='submit' onClick={ this.save } class="btn btn-outline-dark">
							{ translate('button_save') }
						</button>
					</div>
				</form>
			</div>
		);
	}
}
export default withRouter(connect()(LoginCard));
