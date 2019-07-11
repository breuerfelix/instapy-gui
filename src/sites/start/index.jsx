import { h, render, Component } from 'preact';
import StartBot from './start_bot';
import Console from './console';

export default class Start extends Component {
	state = {
		namespace: null,
		bot: null,
		setting: null
	}

	render(props, { namespace, bot, setting }) {
		const firstRowHeight = '400px';
		return (
			<div>
				<div className='row'>

					<div className='col-padding col-md'>
						<StartBot
							namespaceChanged={ namespace => this.setState({ namespace }) }
							namespace={ namespace }
							height={ firstRowHeight }
							bot={ bot }
							botChanged={ bot => this.setState({ bot }) }
							setting={ setting }
							settingChanged={ setting => this.setState({ setting }) }
						/>
					</div>

					<div className='col-padding col-md'></div>

				</div>

				<div className='row'>

					<div className='col-padding col'>
						<Console bot={ bot } />
					</div>
				</div>
			</div>
		);
	}
}
