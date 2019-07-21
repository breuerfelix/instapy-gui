import { h, render, Component } from 'preact';
import StartBot from './start_bot';
import Console from './console';
import { InfoCard } from 'components';

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

					<div className='col-padding col-md'>
						<InfoCard height={ firstRowHeight }>
							Handling all your bots and be up-to-date with their status will be done from this site.
							<br />
							<br />
							Click <a href='https://github.com/breuerfelix/instapy-gui' target='__blank'>here</a> to see a guide on how to setup bots which can be started from this panel.
							<br />
							<br />
							The console shows the current output from any selected bot.
							<br />
							<br />
							Do not forget to set your Instagram username and password in the according settings.
						</InfoCard>
					</div>

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
