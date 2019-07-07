import { h, render, Component } from 'preact';
import { AddCard } from '../components';
import { withRouter } from 'react-router-dom';
import { AddSettingsModal } from 'modals';
import { ConfigService } from 'services';

class Settings extends Component {
	state = {
		settings: []
	}

	componentWillMount() {
		ConfigService.getSettings().then(settings => this.setState({ settings }));
	}

	addSettings = async setting => {
		// await here, so the setting will be registered once we change the route
		setting = await ConfigService.updateSetting({
			action: 'add',
			data: setting
		});

		const { settings } = this.state;
		settings.push(setting);
		this.setState({ settings });
	}

	render(props, { settings }) {
		return (
			<div>
				<AddCard target='#settings-modal' />
				<AddSettingsModal settings={ settings } add={ this.addSettings } />
			</div>
		);
	}
}

export default withRouter(Settings);
