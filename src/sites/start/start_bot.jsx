import { h, render, Component } from 'preact';
import { SocketService, ConfigService, translate } from 'services';
import classNames from 'classnames';

export default class StartBot extends Component {
	state = {
		namespaces: [],
		namespace: null,
		running: false,
		status: 'exited'
	}

	toggleBot = e => {
		e.preventDefault();
		const { namespace, running } = this.state;

		SocketService.send({
			handler: 'bot_state',
			action: 'toggle',
			running: !running,
			namespace: namespace.ident
		});

		// todo disable button
		this.setState({ running: !running, status: 'loading' });

		SocketService.send({
			handler: 'bot_state',
			action: 'get'
		});
	}

	namespaceChanged = e => {
		const { namespaces } = this.state;
		const namespace = namespaces.find(x => x.ident == e.target.value);
		this.setState({ namespace });
	}

	recieveSocketData = data => {
		if (data.handler != 'bot_state') return;

		this.setState({
			running: data.running,
			status: data.status
		});
	}

	componentWillMount() {
		SocketService.register(this, this.recieveSocketData);

		// event to get current bot state
		SocketService.send({
			handler: 'bot_state',
			action: 'get'
		});

		ConfigService.fetchNamespaces()
			.then(namespaces => {
				this.setState({ namespaces });

				// set first namespace if there is one
				if (namespaces) this.setState({ namespace: namespaces[0] });
			});
	}

	getBotState = () => {
		// event to get current bot state
		SocketService.send({
			handler: 'bot_state',
			action: 'get'
		});
	}

	componentWillUnmount() {
		SocketService.unregister(this);
	}

	render(props, { namespaces, namespace, running, status }) {
		const namespaceOptions = namespaces.map(namespace =>
			<option value={ namespace.ident }>{ namespace.name }</option>
		);

		const buttonText = running ? 'button_stop' : 'button_start';

		const statusText = 'status_' + status;
		const statusBadge = classNames({
			'badge': true,
			'badge-danger': status == 'exited',
			'badge-success': status == 'running',
			'badge-primary': status == 'loading'
		});

		return (
			<div className='card'>
				<div className='card-header'>
					{ translate('startbot_title') }
				</div>
				<div className='card-body'>
					<label>{ translate('startbot_select_namespace') }</label>
					<select
						value={ namespace ? namespace.ident : null }
						className='form-control'
						onChange={ this.namespaceChanged }
					>
						{ namespaceOptions }
					</select>

				</div>
				<div className='card-footer row align-items-center'>
					<div className='col'>
						{ translate('status') }:<span className={ statusBadge } style={{ marginLeft: '7px' }}>{ translate(statusText) }</span>
					</div>
					<div className='col' style={{ textAlign: 'right' }}>
						<button onClick={ this.toggleBot } className='btn btn-outline-dark' disabled={ status == 'loading' }>
							{ status == 'loading' &&
								<span
									className='spinner-border spinner-border-sm'
									role='status'
									aira-hidden='true'
								/>
							}
							{ status != 'loading' &&
								translate(buttonText)
							}
						</button>
					</div>
				</div>
			</div>
		);
	}
}
