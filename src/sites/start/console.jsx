import { h, render, Component } from 'preact';
import { SocketService, translate } from 'services';

export default class Console extends Component {
	state = {
		logList: [],
		scrolled: false
	}

	recieveSocketData = data => {
		if (data.handler != 'logger') return;

		const { logList, scrolled } = this.state;
		logList.splice(0, 0, data.message);
		this.setState({ logList });
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
				<div className='card-body'>
					<ul id='console_window'>
						{ logs }
					</ul>
				</div>
			</div>
		);
	}
}
