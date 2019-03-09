import { h, render, Component } from 'preact';
import { SocketService, translate } from 'services';
import $ from 'jquery';

export default class Console extends Component {
	state = {
		logList: [],
		scrolled: false
	}

	recieveSocketData = data => {
		if (data.handler != 'logger') return;

		if (data.action == 'single') {
			const { logList } = this.state;

			// remove description cause they crash the UI
			// TODO fix display of description
			// TODO render emojis

			logList.push(data.message);
			this.setState({ logList });
		}

		if (data.action == 'multiple') {
			// overwrite logs from server logs
			// why filter ? read above
			const logList = [ ...data.message ];
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
		SocketService.register(this, this.recieveSocketData);

		// event to get all past logs
		SocketService.send({
			handler: 'logger',
			action: 'get'
		});
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
		SocketService.unregister(this);
	}

	render(props, { logList }) {
		// TODO pretty print, highlight time / user/ whatever
		const logs = logList.map(log =>
			<li>{ log }</li>
		);

		return (
			<div className='card console'>
				<div className='card-header'>
					{ translate('console_title') }
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
