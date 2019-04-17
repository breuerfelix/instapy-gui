import { h, render, Component } from 'preact';
import { ConfigService, translate } from 'services';
import classNames from 'classnames';
import linkState from 'linkstate';
import { withRouter } from 'react-router-dom';

class ProxyCard extends Component {
	state = {
		inputHost: '',
		inputPort: '',
		inputUsername: '',
		inputPassword: '',

		errorHost: false,
		errorPort: false
	}

	componentWillMount() {
		ConfigService.getProxy().then(res => {
			console.log(res)
			this.setState({
				inputHost: res.host,
				inputPort: res.port,
				inputUsername: res.username,
				inputPassword: res.password
			});
		});
	}

	submit = async e => {
		e.preventDefault();

		const { inputHost, inputPort } = this.state;
		if (inputHost || inputPort) {
			this.setState({
				errorPort: isNaN(inputPort) || !inputPort,
				errorHost: !inputHost
			});

			const { errorHost, errorPort } = this.state;
			if (errorHost || errorPort) return;
		}

		// reset errors in case of reset button
		this.setState({ errorPort: false, errorHost: false });

		const { inputUsername, inputPassword } = this.state;
		await ConfigService.setProxy(inputHost, inputPort, inputUsername, inputPassword);

		this.props.history.push('/');
	}

	reset = e => {
		e.preventDefault();

		this.setState({
			inputHost: '',
			inputPort: '',
			inputUsername: '',
			inputPassword: ''
		});

		this.submit(e);
	}

	render(props, {
		inputHost,
		inputPort,
		inputUsername,
		inputPassword,
		errorHost,
		errorPort
	}) {
		const hostClass = classNames({
			'form-control': true,
			'is-invalid': errorHost
		});

		const portClass = classNames({
			'form-control': true,
			'is-invalid': errorPort
		});

		return (
			<div className='col-padding col'>
				<div className='card proxy'>
					<form onSubmit={ this.submit }>
						<div className='card-header'>
							{ translate('proxy_title') }
						</div>
						<div className='card-body'>
							<div className='row'>

								<div className='col'>
									<div className='input-group'>
										<div className='input-group-prepend'>
											<i className='input-group-text fas fa-server' />
										</div>
										<input
											className={ hostClass }
											type='text'
											placeholder={ translate('proxy_host') }
											value={ inputHost }
											onInput={ linkState(this, 'inputHost') }
										/>
									</div>

									<div className='input-group'>
										<div className='input-group-prepend'>
											<i className='input-group-text fas fa-cloud' />
										</div>
										<input
											className={ portClass }
											type='text'
											placeholder={ translate('proxy_port') }
											value={ inputPort }
											onInput={ linkState(this, 'inputPort') }
										/>
									</div>
								</div>

								<div className='col'>
									<div className='input-group'>
										<div className='input-group-prepend'>
											<i className='input-group-text fas fa-user' />
										</div>
										<input
											className='form-control'
											type='text'
											placeholder={ translate('proxy_username') }
											value={ inputUsername }
											onInput={ linkState(this, 'inputUsername') }
										/>
									</div>

									<div className='input-group'>
										<div className='input-group-prepend'>
											<i className='input-group-text fas fa-lock' />
										</div>
										<input
											className='form-control'
											type='text'
											placeholder={ translate('proxy_password') }
											value={ inputPassword }
											onInput={ linkState(this, 'inputPassword') }
										/>
									</div>
								</div>

							</div>
						</div>
						<div className='card-footer row align-items-center'>
							<div className='col'>
								<button type='submit' className='btn btn-outline-dark'>
									{ translate('button_save') }
								</button>
							</div>
							<div style={{ textAlign: 'right' }}>
								<button onClick={ this.reset } className='btn btn-outline-dark'>
									{ translate('button_reset') }
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default withRouter(ProxyCard);
