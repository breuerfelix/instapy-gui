import { h, render, Component } from 'preact';
import { translate } from 'services';

export default class NamespaceSelection extends Component {
	namespaceChanged = e => {
		//route(`/configuration/${e.target.value}`);
	}

	render({ namespaces, namespace, addNamespace, deleteNamespace }) {
		const namespaceOptions = namespaces.map(namespace =>
			<option value={ namespace.ident }>{ namespace.name }</option>
		);

		return (
			<div class="uk-grid">
				<div className="uk-width-1-2@s">
					<form class='uk-form-stacked uk-margin-top'>
						<label className="uk-form-label">
							{ translate('configuration_namespaces') }
						</label>
						<div className="uk-grid uk-grid-small">
							<div className="uk-width-1-2@s">
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

							<div className="uk-width-1-2@s">
								<ul class="uk-iconnav">
									<li>
										<a
											uk-icon={ 'icon: plus; ratio: 1.2;' }
											class='uk-margin-left'
											type='button'
											uk-toggle='target: #add-namespace-modal'
										></a>
									</li>
									<Icon name='trash' onClick={ deleteNamespace } />
								</ul>
							</div>
						</div>
					</form>
				</div>
				<div className="uk-width-1-2@s">
					<button class="uk-button uk-button-default uk-position-medium">{ translate('button_add_job') }</button>
				</div>
			</div>
		);
	}
}

const Icon = ({ name, onClick }) => (
	<li>
		<a
			uk-icon={ `icon: ${name}; ratio: 1.2;` }
			class='uk-margin-left'
			onClick={ onClick }
		></a>
	</li>
);
