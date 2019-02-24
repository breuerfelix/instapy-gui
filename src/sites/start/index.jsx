import { h, render, Component } from 'preact';
import { translate } from 'services';
import StartBot from './start_bot';
import Console from './console';

export default class Start extends Component {
	render() {
		return (
			<div>
				<div className='row'>

					<div className='col-padding col-md'>
						<StartBot />
					</div>

					<div className='col-padding col-md'>
					</div>

				</div>

				<div className='row'>

					<div className='col-padding col'>
						<Console />
					</div>
				</div>
			</div>
		);
	}
}
