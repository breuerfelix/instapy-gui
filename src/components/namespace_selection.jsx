import { h, render, Component } from 'preact';
import { translate } from 'services';
import { route } from 'preact-router';

export default class NamespaceSelection extends Component {
	state = {
	}

	namespaceChanged = e => {
		route(`/configuration/${e.target.value}`);
	}

	render({ namespaces, namespace }) {
		const namespaceOptions = namespaces.map(namespace =>
			<option value={ namespace.ident }>{ namespace.name }</option>
		);

		return (
			<form class='uk-grid-small uk-form-stacked uk-margin-top'>
				<div className="uk-width-1-2@s">
					<label className="uk-form-label">
						{ translate('namespaces') }
					</label>
					<div className="uk-form-controls">
						<select
							value={ namespace }
							className="uk-select"
							onChange={ this.namespaceChanged }
						>
							{ namespaceOptions }
						</select>
					</div>
				</div>
			</form>
		);
	}
}
