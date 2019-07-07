import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import slugify from 'slugify';
import $ from 'jquery';

export default class AddSettingsModal extends Component {
	state = {
		inputName: null,
		inputDescription: null,

		errorName: false,
		errorDescription: false
	}

	addSettings = e => {
		e.preventDefault();
		const { inputName, inputDescription } = this.state;

		this.setState({
			errorDescription: !inputDescription,
			errorName: !inputName
		});

		const { errorDescription, errorName } = this.state;
		if (errorDescription || errorName) return;


		const slug = slugify(inputName, {
			lower: true,
			// TODO extend with a nice remove regex like -> remove: /[*+~.()'"!:@]/},
		});

		const found = this.props.settings.find(x => x.ident == slug);

		if (found) {
			this.setState({ errorName: true });
			const errorText = 'Settings with this identifier already exists!';
			console.warn(errorText);
			alert(errorText);
			return;
		}

		this.props.add({
			ident: slug,
			name: inputName,
			description: inputDescription
		});

		$(this.modal).modal('hide');
	}

	render(props, {
		inputName,
		inputDescription,
		errorDescription,
		errorName
	}) {

		const inputNameClass = classNames({
			'form-control': true,
			'is-invalid': errorName
		});

		const inputDescriptionClass = classNames({
			'form-control': true,
			'is-invalid': errorDescription
		});

		return (
			<div
				ref={ modal => this.modal = modal }
				id='settings-modal'
				className='modal fade'
				tabIndex='-1'
				role='dialog'
				aria-hidden='true'
				arial-labelledby='add-settings-modal-title'
			>
				<div className='modal-dialog' role='document'>
					<div className="modal-content">
						<div className="modal-header">
							<h5 id='add-settings-modal-title' className="modal-title">{ translate('new_settings_title') }</h5>
							<button className="close" type='button' data-dismiss='modal' aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<form onSubmit={ this.addSettings }>
								<div className="form-group">
									<label>{ translate('settings_name_label') }</label>
									<div className="input-group">
										<input
											className={ inputNameClass }
											type="text"
											placeholder={ translate('settings_name_placeholder') }
											value={ inputName }
											onInput={ linkState(this, 'inputName') }
										/>
									</div>
								</div>

								<div className="form-group">
									<label>{ translate('settings_description_label') }</label>
									<div className="input-group">
										<textarea
											className={ inputDescriptionClass }
											type="text"
											placeholder={ translate('settings_description_placeholder') }
											value={ inputDescription }
											onInput={ linkState(this, 'inputDescription') }
											rows='3'
										/>
									</div>
								</div>

							</form>
						</div>

						<div className="modal-footer">
							<button
								className="btn btn-outline-dark"
								data-dismiss='modal'
								type="button"
							>
								{ translate('button_cancel') }
							</button>
							<button
								className="btn btn-outline-dark"
								onClick={ this.addSettings }
								type="submit"
							>
								{ translate('button_save') }
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
