import { h, render, Component } from 'preact';
import { SocketService, ConfigService, translate } from 'services';
import classNames from 'classnames';

export default class StartBot extends Component {
	state = {
		namespaces: [],
		bots: [],
		settings: [],
		running: false,
		status: 'stopped', // or running
		errorNamespace: false,
		errorBot: false,
		errorSetting: false
	}

	toggleBot = e => {
		e.preventDefault();
		const { running } = this.state;
		const { bot, namespace, setting } = this.props;

		this.setState({ errorBot: !bot });
		if (this.state.errorBot) return;

		if (!running) {
			// that means, bot will be started
			this.setState({
				errorNamespace: !namespace,
				errorSetting: !setting
			});

			if (this.state.errorNamespace || this.state.errorSetting) return;
		}

		SocketService.send({
			handler: 'bot',
			start: !running,
			namespace: namespace.ident,
			setting: setting.ident,
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

		const { namespaceChanged } = this.props;
		namespaceChanged(namespace);
	}

	settingChanged = e => {
		const { settings } = this.state;
		const setting = settings.find(x => x.ident == e.target.value);

		const { settingChanged } = this.props;
		settingChanged(setting);
	}

	updateStatus = data => {
		const { status, namespaceIdent, settingIdent } = data;
		const { settings, namespaces } = this.state;
		const { settingChanged, namespaceChanged } = this.props;

		this.setState({
			running: status == 'running',
			status
		});

		// set namespace and template to selected bot
		if (namespaceIdent) {
			const namespace = namespaces.find(x => x.ident == namespaceIdent);
			if (namespace) namespaceChanged(namespace);
		}

		if (settingIdent) {
			const setting = settings.find(x => x.ident == settingIdent);
			if (setting) settingChanged(setting);
		}
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
					const { namespaceChanged } = this.props;
					namespaceChanged(namespaces[0]);
				}
			});

		ConfigService.getSettings()
			.then(settings => {
				this.setState({ settings });

				// set first namespace if there is one
				if (settings) {
					const { settingChanged } = this.props;
					settingChanged(settings[0]);
				}
			});
	}

	componentWillUnmount() {
		SocketService.unregister('status', this.updateStatus);
		SocketService.unregister('bots', this.updateBots);
	}

	render(
		{ height, bot, namespace, setting },
		{ namespaces, bots, settings, running, status, errorNamespace, errorBot, errorSetting }
	) {
		const namespaceOptions = namespaces.map(({ ident, name }) =>
			<option key={ ident } value={ ident }>{ name }</option>
		);

		const settingOptions = settings.map(({ ident, name }) =>
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

		const botSelectClass = classNames({
			'form-control': true,
			'is-invalid': errorBot
		});

		const namespaceSelectClass = classNames({
			'form-control': true,
			'is-invalid': errorNamespace
		});

		const settingSelectClass = classNames({
			'form-control': true,
			'is-invalid': errorSetting
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
						className={ botSelectClass }
						onChange={ e => this.botChanged(e.target.value) }
					>
						{ botOptions }
					</select>

					<label
						style={{ marginTop: '10px' }}
					>
						{ translate('startbot_select_setting') }
					</label>
					<select
						value={ setting ? setting.ident : null }
						className={ settingSelectClass }
						onChange={ this.settingChanged }
					>
						{ settingOptions }
					</select>

					<label
						style={{ marginTop: '10px' }}
					>
						{ translate('startbot_select_namespace') }
					</label>
					<select
						value={ namespace ? namespace.ident : null }
						className={ namespaceSelectClass }
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