import { h, render, Component } from 'preact';
import { translate } from 'services';
import { IframeCard } from 'components';

export default class Dashboard extends Component {
	render() {
		return (
			<div>
				<div className='row'>

					<div className='col-padding col-md'>
						<IframeCard
							link={
								`http://${location.host}` +
								'/grafana/d-solo/iRL_jxrmz/stats-1h-group-by-1m?orgId=1&refresh=10s&var-Time=1m&panelId=2'
							}
							title='Follower Stats 1h'
						/>
					</div>

					<div className='col-padding col-md'>
						<IframeCard
							link={
								`http://${location.host}` +
								'/grafana/d-solo/I5CAML9mz/stats-24h-group-by-10m?refresh=10s&orgId=1&panelId=2'
							}
							title='Follower Stats 24h'
						/>
					</div>

				</div>

				<div className='row'>

					<div className='col-padding col'>
					</div>
				</div>
			</div>
		);
	}
}
