import { h, render, Component } from 'preact';
import { SocketService, translate } from 'services';
import $ from 'jquery';

export default class Console extends Component {
	state = {
		logList: [],
		scrolled: false,
		bot: null
	}

	receiveLogs = data => {
		if (data.action == 'single') {
			const { logList } = this.state;
			// only show logs which are for the current selected bot
			if (data.bot && data.bot != this.state.bot) return;

			// TODO fix display of description
			// TODO render emojis

			logList.push(data.message);
			this.setState({ logList });
		}

		if (data.action == 'set') {
			const logList = [ ...data.logs ];
			this.setState({ logList });
		}

		const { scrolled } = this.state;
		if (scrolled) return;

		// timeout to the new items are rendered
		setTimeout(() => {
			const body = $(this.body);
			// scroll to bottom
			body.animate({
				scrollTop: body.prop('scrollHeight') - body.prop('clientHeight')
			}, 1000);
		}, 200);
	}

	componentWillMount() {
		SocketService.register('logs', this.receiveLogs);
		const { bot } = this.props;
		this.setState({ bot });
	}

	componentDidMount() {
		let enableScroll = null;
		$(this.body).bind('DOMMouseScroll mousewheel touchmove mousemove', () => {
			this.setState({ scrolled: true });

			// reset timeout
			if (enableScroll) {
				clearTimeout(enableScroll);
				enableScroll = null;
			}

			// reenable scrolling after 5 seconds
			enableScroll = setTimeout(() => this.setState({ scrolled: false }), 5000);
		});
	}

	componentWillUnmount() {
		SocketService.unregister('logs', this.receiveLogs);
	}

	render(props, { logList, bot }) {
		if (bot != props.bot) {
			this.setState({ bot: props.bot });
			SocketService.send({
				handler: 'logs',
				action: 'get',
				bot: props.bot
			});
		}

		// TODO pretty print, highlight time / user/ whatever
		const logs = logList.map(log =>
			<li>{ log }</li>
		);

		return (
			<div className='card console'>
				<div className='card-header'>
					{ translate('console_title') + (bot ? `: ${bot}` : '') }
				</div>
				<div
					className='card-body'
				>
					<ul
						className='overflow-auto'
						ref={ body => this.body = body }
					>
						{ logs }
					</ul>
				</div>
			</div>
		);
	}
}
