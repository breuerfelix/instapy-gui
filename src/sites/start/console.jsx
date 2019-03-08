import { h, render, Component } from 'preact';
import { SocketService, translate } from 'services';

export default class Console extends Component {
	state = {
		logList: []
	}

	recieveSocketData = data => {
		if (data.handler != 'logger') return;

		if (data.action == 'single') {
			const { logList } = this.state;
			logList.splice(0, 0, data.message);
			this.setState({ logList });
			return;
		}

		if (data.action == 'multiple') {
			// overwrite logs from server logs
			const logList = [ ...data.message.reverse() ];
			this.setState({ logList });
			return;
		}
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
				<div className='card-body overflow-auto'>
					<ul>
						{ logs }
					</ul>
				</div>
			</div>
		);
	}
}
