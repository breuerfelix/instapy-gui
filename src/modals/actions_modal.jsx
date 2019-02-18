import { h, render, Component } from 'preact';
import { translate } from 'services';
import linkState from 'linkstate';
import classNames from 'classnames';
import $ from 'jquery';
import { connect } from 'store';

@connect('actions')
export default class ActionsModal extends Component {
	state = {
		inputSearch: null
	}

	addAction = action => {
		$(this.modal).modal('hide');
		const { add } = this.props;
		add(action);
	}

	render({ actions }, { inputSearch }) {
		const setActions = actions.filter(action => action.functionName.startsWith('set'));
		const followActions = actions.filter(action => action.functionName.startsWith('follow'));
		const interactActions = actions.filter(action => action.functionName.startsWith('interact'));

		return (
			<div
				ref={ modal => this.modal = modal }
				id="actions-modal"
				class='modal fade'
				tabindex='-1'
				role='dialog'
				aria-hidden='true'
				arial-labelledby='actions-modal-title'
			>
				<div class='modal-dialog' role='document'>
					<div className="modal-content">
						<div class="modal-header">
							<h5 id='actions-modal-title' class="modal-title">{ translate('actions_title') }</h5>
							<button className="close" type='button' data-dismiss='modal' aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<div class="form-group">
								<div className="input-group">
									<input
										class='form-control'
										type='text'
										placeholder={ translate('input_search_placeholder') }
										value={ inputSearch }
										onInput={ linkState(this, 'inputSearch') }
										disabled
									/>
								</div>
							</div>

							<ul class="nav nav-tabs nav-justified" id="actions-tab" role="tablist">
								<TabHeader name='set' active={ true } />
								<TabHeader name='follow' />
								<TabHeader name='interact' />
							</ul>
							<div class="tab-content">
								<TabContent name='set' actions={ setActions } add={ this.addAction } active={ true } />
								<TabContent name='follow' actions={ followActions } add={ this.addAction } />
								<TabContent name='interact' actions={ interactActions } add={ this.addAction } />
							</div>

						</div>

						{ false &&
							<div class="modal-footer">
								<button
									class="btn btn-outline-dark"
									data-dismiss='modal'
									type="button"
								>
									{ translate('button_cancel') }
								</button>
								<button
									class="btn btn-outline-dark"
									onClick={ this.addAction }
									type="button"
								>
									{ translate('button_add') }
								</button>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

const TabHeader = ({ name, active = false }) => {
	const classes = classNames({
		'nav-link': true,
		'active': active
	});

	return (
		<li class="nav-item">
			<a
				class={ classes }
				id={ `${name}-tab` }
				data-toggle="tab"
				href={ `#${name}` }
				role="tab"
				aria-controls={ name }
				aria-selected="true"
			>
				{ translate(`actions_tab_${name}`) }
			</a>
		</li>
	);
};

const TabContent = ({ name, actions, add, active = false }) => {
	const classes = classNames({
		'tab-pane': true,
		'fade': true,
		'show': active,
		'active': active
	});

	return (
		<div
			class={ classes }
			id={ name }
			role="tabpanel"
			aria-labelledby={ `${name}-tab` }
		>
			<ActionTable actions={ actions } add={ add } />
		</div>
	);
};

const ActionTable = ({ actions, add }) => {
	const css = {
		cursor: 'pointer',
		color: 'black',
		outline: 0,
		border: 'none'
	};

	const rows = actions.map(action =>
		<tr>
			<td>{ action.functionName }</td>
			<td>
				<a
					tabindex='0'
					style={ css }
					class='fas fa-info noselect'
					data-container='body'
					data-trigger='focus'
					data-toggle='popover'
					data-placement='top'
					data-content={ action.description }
				/>
			</td>
			<td>
				<a
					class='fas fa-plus'
					onClick={ e => { e.preventDefault(); add(action); } }
					style='cursor: pointer;'>
				</a>
			</td>
		</tr>
	);

	// enable popover
	$('[data-toggle="popover"]').popover();

	return (
		<table class="table table-hover">
			<tbody>
				{ rows }
			</tbody>
		</table>
	);
};
