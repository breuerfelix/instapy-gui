import { h, render, Component } from 'preact';
import { translate } from 'services';
import { IframeCard } from 'components';
import { connect } from 'store';

@connect('username')
class Dashboard extends Component {
	render({ username }) {
		return (<div>tst</div>);
		return (
			<div>
				<div className='row'>

					<div className='col-padding col-md'>
						<IframeCard
							link={
								`http://${location.host}` +
								'/grafana/d-solo/iRL_jxrmz/stats-1h-group-by-1m?orgId=1&refresh=10s&var-Time=1m&panelId=2'
							}
							title='Bot activity past hour'
						/>
					</div>

					<div className='col-padding col-md'>
						<IframeCard
							link={
								`http://${location.host}` +
								'/grafana/d-solo/I5CAML9mz/stats-24h-group-by-10m?refresh=10s&orgId=1&panelId=2'
							}
							title='Bot activity past 24h'
						/>
					</div>

				</div>
				<div className='row'>

					<div className='col-padding col-md'>
						<IframeCard
							link={
								`http://${location.host}` +
								`/grafana/d-solo/yT2CkfGWz/follower-count?orgId=1&var-username=${username}&refresh=5m&panelId=2`
							}
							title='Followers count past 30 days'
						/>
					</div>

					<div className='col-padding col-md'>
					</div>

				</div>
			</div>
		);
	}
}

export default Dashboard;