import { h, render, Component } from 'preact';
import { translate } from 'services';
import StartBot from './start_bot';
import Console from './console';
import { DescriptionCard } from 'sites/configuration/cards';

export default class Start extends Component {
	state = {
		namespace: null
	}

	render(props, { namespace }) {
		const firstRowHeight = '230px';
		return (
			<div>
				<div className='row'>

					<div className='col-padding col-md'>
						<StartBot
							namespaceChanged={ namespace => this.setState({ namespace }) }
							height={ firstRowHeight }
						/>
					</div>

					<div className='col-padding col-md'>
						{ namespace &&
							<DescriptionCard namespace={ namespace } height={ firstRowHeight } />
						}
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
