import { h, render, Component } from 'preact';
import { translate } from 'services';
import StartBot from './start_bot';

export default class Start extends Component {
	componentWillMount() {
	}

	render() {
		return (
			<div class='row'>

				<div className='col-padding col-md'>
					<StartBot />
				</div>

				<div className='col-padding col-md'>
					second card
				</div>

			</div>
		);
	}
}
