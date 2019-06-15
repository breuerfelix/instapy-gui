import { h, render, Component } from 'preact';
import { SocketService, ConfigService, translate } from 'services';
import classNames from 'classnames';
import { connect } from 'store';
import { withRouter } from 'react-router-dom';

class StartBot extends Component {
	state = {
		namespaces: [],
		namespace: null,
		bots: [],
		running: false,
		status: 'stopped' // or running
	}

	toggleBot = e => {
		e.preventDefault();
		const { namespace, running } = this.state;
		const { bot } = this.props;

		if (!running) {
			// that means, bot will be started
			const { username, history } = this.props;

			// redirect to login page if not logged in
			if (!username) {
				history.push('/account/login');
				return;
			}
		}

		SocketService.send({
			handler: 'bot',
			start: !running,
			namespace: namespace.ident,
			bot
		});

		this.setState({ running: !running, status: 'loading' });

		SocketService.send({
			handler: 'status',
			action: 'get',
			ident: bot
		});

		// refresh logs, since they get deleted on start
		SocketService.send({
			handler: 'logs',
			action: 'get',
			bot
		});
	}

	namespaceChanged = e => {
		const { namespaces } = this.state;
		const namespace = namespaces.find(x => x.ident == e.target.value);
		this.setState({ namespace });

		const { namespaceChanged } = this.props;
		namespaceChanged(namespace);
	}

	updateStatus = data => {
		const { status } = data;
		this.setState({
			running: status == 'running',
			status
		});
	}

	botChanged = bot => {
		const { botChanged } = this.props;

		SocketService.send({
			handler: 'status',
			action: 'get',
			ident: bot
		});

		botChanged(bot);
	}

	updateBots = res => {
		const bots = res.data;
		this.setState({ bots });
		if (!bots.length) return;
		this.botChanged(bots[0]);
	}

	componentWillMount() {
		SocketService.register('status', this.updateStatus);
		SocketService.register('bots', this.updateBots);

		SocketService.send({
			handler: 'bots'
		});

		ConfigService.fetchNamespaces()
			.then(namespaces => {
				this.setState({ namespaces });

				// set first namespace if there is one
				if (namespaces) {
					this.setState({ namespace: namespaces[0] });
					const { namespaceChanged } = this.props;
					namespaceChanged(namespaces[0]);
				}
			});
	}

	componentWillUnmount() {
		SocketService.unregister('status', this.updateStatus);
		SocketService.unregister('bots', this.updateBots);
	}

	render({ height, bot }, { namespaces, namespace, bots, running, status }) {
		const namespaceOptions = namespaces.map(({ ident, name }) =>
			<option key={ ident } value={ ident }>{ name }</option>
		);

		const botOptions = bots.map(bot =>
			<option key={ bot } value={ bot }>{ bot }</option>
		);

		const buttonText = running ? 'button_stop' : 'button_start';

		const statusText = 'status_' + status;
		const statusBadge = classNames({
			'badge': true,
			'badge-danger': status == 'stopped',
			'badge-success': status == 'running',
			'badge-primary': status == 'loading'
		});

		return (
			<div className='card' style={{ height }}>
				<div className='card-header'>
					{ translate('startbot_title') }
				</div>
				<div className='card-body'>

					<label>{ translate('startbot_select_bot') }</label>
					<select
						value={ bot }
						className='form-control'
						onChange={ e => this.botChanged(e.target.value) }
					>
						{ botOptions }
					</select>

					<label
						style={{ marginTop: '10px' }}
					>
						{ translate('startbot_select_namespace') }
					</label>
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
						{ translate('status') }:
						<span
							className={ statusBadge }
							style={{ marginLeft: '7px' }}
						>
							{ translate(statusText) }
						</span>
					</div>
					<div className='col' style={{ textAlign: 'right' }}>
						<button
							onClick={ this.toggleBot }
							className='btn btn-outline-dark'
							disabled={ status == 'loading' }
						>
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

export default withRouter(connect('username')(StartBot));
