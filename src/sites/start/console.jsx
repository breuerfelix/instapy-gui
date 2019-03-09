import { h, render, Component } from 'preact';
import { SocketService, translate } from 'services';
import $ from 'jquery';

export default class Console extends Component {
	state = {
		logList: []
	}

	recieveSocketData = data => {
		if (data.handler != 'logger') return;

		if (data.action == 'single') {
			const { logList } = this.state;

			// remove description cause they crash the UI
			// TODO fix display of description
			// TODO render emojis
			if (data.message.includes('Description')) return;

			logList.push(data.message);
			this.setState({ logList });
		}

		if (data.action == 'multiple') {
			// overwrite logs from server logs
			// why filter ? read above
			const logList = [ ...data.message.filter(x => !x.includes('Description')) ];
			this.setState({ logList });
		}

		// timeout to the new items are rendered
		setTimeout(() => {
			const body = $(this.body);
			// scroll to bottom
			body.animate({
				scrollTop: body.prop('scrollHeight') - body.prop('clientHeight')
			}, 1000);
		}, 250);
	}

	componentWillMount() {
		SocketService.register(this, this.recieveSocketData);

		// event to get all past logs
		SocketService.send({
			handler: 'logger',
			action: 'get'
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
					className='card-body overflow-auto'
					ref={ body => this.body = body }
					style={{ whiteSpace: 'nowrap' }}
				>
					<ul>
						{ logs }
					</ul>
				</div>
			</div>
		);
	}
}
