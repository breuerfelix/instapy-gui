import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';

export default class AddNamespaceModal extends Component {
	state = {
		inputIdentifier: null,
		inputName: null,
		inputDescription: null
	}

	addNamespace = _ => {
		console.log(this.state);

	}

	render(props, { inputIdentifier, inputName, inputDescription }) {
		return (
			<div id="add-namespace-modal" class='uk-modal' uk-modal>
				<div class="uk-modal-dialog uk-margin-auto-vertical">
					<button class="uk-modal-close-default" type="button" uk-close></button>
					<div class="uk-modal-header">
						<h3 class="uk-modal-title">{ translate('new_namespace_title') }</h3>
					</div>
					<div class="uk-modal-body">
						<form class="uk-form-horizontal uk-margin-large">
							<Input
								label='namespace_identifier_label'
								placeholder='namespace_identifier_placeholder'
								tooltip='namespace_identifier_tooltip'
								value={ inputIdentifier }
								link='inputIdentifier'
								stateObj={ this }
							/>
							<Input
								label='namespace_Name_label'
								placeholder='namespace_Name_placeholder'
								tooltip='namespace_Name_tooltip'
								value={ inputName }
								link='inputName'
								stateObj={ this }
							/>
							<Input
								label='namespace_description_label'
								placeholder='namespace_description_placeholder'
								tooltip='namespace_description_tooltip'
								value={ inputDescription }
								link='inputDescription'
								stateObj={ this }
							/>
						</form>
					</div>
					<div class="uk-modal-footer uk-text-right">
						<button
							class="uk-button uk-button-primary uk-modal-close"
							onClick={ this.addNamespace }
							type="button"
						>
							{ translate('button_save') }
						</button>
						<button
							class="uk-button uk-button-default uk-modal-close uk-margin-left"
							type="button"
						>
							{ translate('button_cancel') }
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const Input = ({ label, placeholder, tooltip, value, link, stateObj }) => (
	<div class="uk-margin">
		<label class="uk-form-label">{ translate(label) }</label>
		<div class="uk-form-controls">
			<div className="uk-inline uk-width-expand">
				<a class="uk-form-icon uk-form-icon-flip" uk-tooltip={ tooltip } uk-icon="icon: info"></a>
				<input
					class="uk-input"
					type="text"
					placeholder={ translate(placeholder) }
					value={ value }
					onInput={ linkState(stateObj, link) }
				/>
			</div>
		</div>
	</div>
);
